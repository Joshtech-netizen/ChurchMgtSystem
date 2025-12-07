<?php
class JwtHandler {
    // CHANGE THIS SECRET KEY TO SOMETHING VERY LONG AND RANDOM!
    private $secret = "YOUR_SUPER_SECRET_KEY_CHANGE_ME_IMMEDIATELY";

    public function encode($data) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode($data);

        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $this->secret, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    public function decode($token) {
        try {
            $tokenParts = explode('.', $token);
            if (count($tokenParts) != 3) return null;

            $header = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[0]));
            $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[1]));
            $signature_provided = $tokenParts[2];

            // Verify Signature
            $signature = hash_hmac('sha256', $tokenParts[0] . "." . $tokenParts[1], $this->secret, true);
            $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

            if ($base64UrlSignature === $signature_provided) {
                return json_decode($payload);
            }
            return null;
        } catch (Exception $e) {
            return null;
        }
    }
}
?>