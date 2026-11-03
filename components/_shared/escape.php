<?php
// Escapes text for interpolation into an HTML string, exactly as escape.js does: & < > " ' become
// &amp; &lt; &gt; &quot; &#39;. null prints nothing; other values print as JS String() would.
declare(strict_types=1);

require_once __DIR__ . '/values.php';

if (!function_exists('ds_escape_html')) {
    function ds_escape_html(mixed $value): string
    {
        $text = $value === null ? '' : ds_string($value);
        return strtr($text, ['&' => '&amp;', '<' => '&lt;', '>' => '&gt;', '"' => '&quot;', "'" => '&#39;']);
    }
}
