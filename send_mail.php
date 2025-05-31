<?php
header('Content-Type: application/json; charset=utf-8');
// Запобігаємо індексації цього файлу пошуковими системами
header('X-Robots-Tag: noindex, nofollow', true);

function clean($val) {
  return htmlspecialchars(trim(stripslashes($val ?? '')), ENT_QUOTES, 'UTF-8');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
  exit;
}

// Перевірка Honeypot
if (!empty($_POST['honeypot'])) {
  // Це, ймовірно, бот, просто тихо завершуємо або логуємо
  echo json_encode(['status' => 'error', 'message' => 'Bot detected']); // Можна змінити на більш нейтральне повідомлення
  exit;
}

$form_type = clean($_POST['form_type'] ?? '');
$name = clean($_POST['name'] ?? '');
$phone_raw = clean($_POST['phone'] ?? ''); // Для контактної форми може не бути телефону
$phone = ''; // Ініціалізуємо

// Універсальні поля UTM, якщо вони є
$utm_source = clean($_POST['utm_source'] ?? 'N/A');
$utm_medium = clean($_POST['utm_medium'] ?? 'N/A');
$utm_campaign = clean($_POST['utm_campaign'] ?? 'N/A');

$telegram_bot_token = "8011978121:AAEKgT0bCuM5bkb4pm8ddUaWQMKEJGyjFYs; // ЗАМІНИ НА СВІЙ РЕАЛЬНИЙ ТОКЕН
$telegram_chat_id = "6132154171";   // ЗАМІНИ НА СВІЙ РЕАЛЬНИЙ CHAT ID
$mail_to = "vladislavpanin071@icloud.com";


$subject = "";
$message_mail_body = ""; // Основний текст для email
$message_telegram_body = ""; // Основний текст для Telegram

$date = clean($_POST['date'] ?? ''); // Для форм бронювання

// Обробка телефонного номера (якщо поле існує і не порожнє)
if (!empty($phone_raw)) {
    $temp_phone = preg_replace('/[^0-9]/', '', $phone_raw);
    if (strlen($temp_phone) == 9) { // 0xxxxxxxxx
        $phone = '+380' . $temp_phone;
    } elseif (strlen($temp_phone) == 10 && substr($temp_phone, 0, 1) == '0') { // 0xxxxxxxxx
         $phone = '+38' . $temp_phone;
    } elseif (strlen($temp_phone) == 12 && substr($temp_phone, 0, 3) == '380') { // 380xxxxxxxxx
        $phone = '+' . $temp_phone;
    } elseif (strlen($temp_phone) == 13 && substr($temp_phone, 0, 4) == '+380') { // +380xxxxxxxxx
         $phone = $temp_phone;
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Некоректний формат телефону. Введіть у форматі +380xxxxxxxxx або 0xxxxxxxxx.']);
        exit;
    }
}


if ($form_type === 'booking') {
    $start_city = clean($_POST['start_city'] ?? 'Не вказано');
    $end_city = clean($_POST['end_city'] ?? 'Не вказано');

    if (empty($name) || empty($phone) || empty($date) || $start_city === 'Не вказано' || $end_city === 'Не вказано') {
        echo json_encode(['status' => 'error', 'message' => 'Будь ласка, заповніть всі обов\'язкові поля.']);
        exit;
    }

    $subject = "Нова заявка (головна форма) - Bus-Timel";
    $message_mail_body = "Ім'я: $name\nТелефон: $phone\nДата: $date\nМаршрут: $start_city – $end_city\n";
    $message_telegram_body = "🔷 НОВА ЗАЯВКА (ГОЛОВНА ФОРМА) 🔷\n\nІм'я: $name\nТелефон: [$phone](tel:$phone)\nДата: $date\nМаршрут: $start_city – $end_city\n";

} elseif ($form_type === 'booking_route_page') {
    $route_name_field = clean($_POST['route_name_field'] ?? 'Не вказано');
    // Можна також отримати start_city_fixed та end_city_fixed, якщо вони потрібні в повідомленні
    // $start_city_fixed = clean($_POST['start_city_fixed'] ?? '');
    // $end_city_fixed = clean($_POST['end_city_fixed'] ?? '');

    if (empty($name) || empty($phone) || empty($date)) {
        echo json_encode(['status' => 'error', 'message' => 'Будь ласка, заповніть всі обов\'язкові поля.']);
        exit;
    }
    
    $subject = "Нова заявка (сторінка маршруту: $route_name_field) - Bus-Timel";
    $message_mail_body = "Ім'я: $name\nТелефон: $phone\nДата: $date\nОбраний маршрут: $route_name_field\n";
    $message_telegram_body = " маршруту: $route_name_field) 🔷\n\nІм'я: $name\nТелефон: [$phone](tel:$phone)\nДата: $date\nОбраний маршрут: $route_name_field\n";

} elseif ($form_type === 'contact') {
    $email_from = clean($_POST['email'] ?? '');
    $contact_message = clean($_POST['message'] ?? '');

    if (empty($name) || empty($email_from) || empty($contact_message)) {
        echo json_encode(['status' => 'error', 'message' => 'Будь ласка, заповніть всі поля контактної форми.']);
        exit;
    }
    if (!filter_var($email_from, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Некоректний формат email.']);
        exit;
    }
    
    $subject = "Нове повідомлення з контактної форми - Bus-Timel";
    $message_mail_body = "Ім'я: $name\nEmail: $email_from\nПовідомлення:\n$contact_message\n";
    $message_telegram_body = "📝 НОВЕ ПОВІДОМЛЕННЯ (КОНТАКТИ) 📝\n\nІм'я: $name\nEmail: $email_from\nПовідомлення:\n$contact_message\n";
    // Для контактної форми телефон не є обов'язковим, тому не перевіряємо його тут, якщо він не відправляється
    // Якщо телефон доданий до контактної форми, розкоментуйте та перевірте:
    // if (empty($phone)) {
    //     echo json_encode(['status' => 'error', 'message' => 'Телефон обов\'язковий для контактної форми.']);
    //     exit;
    // }

} else {
    echo json_encode(['status' => 'error', 'message' => 'Невідомий або не вказаний тип форми.']);
    exit;
}

// Додавання UTM міток до повідомлень, якщо вони є
$utm_info = "";
if ($utm_source !== 'N/A' || $utm_medium !== 'N/A' || $utm_campaign !== 'N/A') {
    $utm_info .= "\nДжерело (UTM):\n";
    $utm_info .= "Source: $utm_source\n";
    $utm_info .= "Medium: $utm_medium\n";
    $utm_info .= "Campaign: $utm_campaign\n";
}

$message_mail_final = "{$message_mail_body}{$utm_info}";
$message_telegram_final = "{$message_telegram_body}{$utm_info}";

// Відправка на пошту
$headers = "From: Bus-Timel <webmaster@{$_SERVER['HTTP_HOST']}>\r\n";
$headers .= "Reply-To: " . ($email_from ?? $mail_to) . "\r\n"; // Якщо є email користувача, використовуємо його для відповіді
$headers .= "Content-Type: text/plain; charset=utf-8\r\n";
$mail_sent = mail($mail_to, "=?utf-8?B?".base64_encode($subject)."?=", $message_mail_final, $headers);

// Відправка в Telegram
$telegram_message_encoded = urlencode($message_telegram_final);
$telegram_url = "https://api.telegram.org/bot{$telegram_bot_token}/sendMessage?chat_id={$telegram_chat_id}&text={$telegram_message_encoded}&parse_mode=Markdown";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $telegram_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Для локального тестування, на продакшн краще true з сертифікатом
$telegram_response_raw = curl_exec($ch);
$telegram_response = json_decode($telegram_response_raw, true);
curl_close($ch);

$telegram_sent = ($telegram_response && isset($telegram_response['ok']) && $telegram_response['ok']);

if ($mail_sent && $telegram_sent) {
    echo json_encode(['status' => 'success', 'message' => 'Дякуємо! Вашу заявку прийнято. Наш менеджер скоро зв\'яжеться з вами.']);
} elseif ($mail_sent) {
    echo json_encode(['status' => 'success', 'message' => 'Дякуємо! Email відправлено, але сталася помилка з Telegram. Ми зв\'яжемося з вами.']);
} elseif ($telegram_sent) {
     echo json_encode(['status' => 'success', 'message' => 'Дякуємо! Повідомлення в Telegram відправлено, але сталася помилка з Email. Ми зв\'яжемося з вами.']);
} else {
    $error_details = "Mail: " . ($mail_sent ? 'OK' : 'Failed') . ". Telegram Response: " . $telegram_response_raw;
    error_log("Send mail error: " . $error_details); // Логування помилки на сервері
    echo json_encode(['status' => 'error', 'message' => 'Сталася помилка при відправці. Спробуйте ще раз або зателефонуйте нам.']);
}

} else {
  echo json_encode(['status' => 'error', 'message' => 'Некоректний запит.']);
}
?>