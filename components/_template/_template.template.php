<?php
// PHP twin of _template.template.js: same args, same defaults, same HTML (tests/php-parity.test.js).
// Convention: <name>.template.php defines ds_render_<snake_name>(array $args = []): string, guarded by function_exists
// so several twins can be required together. Plain PHP 8.4, no WordPress functions; text goes through ds_escape_html.
declare(strict_types=1);

require_once __DIR__ . '/../_shared/escape.php';

if (!function_exists('ds_render_example')) {
    function ds_render_example(array $args = []): string
    {
        ['text' => $text, 'pressed' => $pressed] = $args + ['text' => 'Przełącznik', 'pressed' => false];
        return '<button type="button" class="ds-example" data-ds-example aria-pressed="' . (ds_truthy($pressed) ? 'true' : 'false') . '">' . ds_escape_html($text) . '</button>';
    }
}
