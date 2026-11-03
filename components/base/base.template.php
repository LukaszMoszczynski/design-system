<?php
// PHP twin of base.template.js: the markup sample for base.css (headings, text, links and code).
declare(strict_types=1);

require_once __DIR__ . '/../_shared/escape.php';

if (!function_exists('ds_render_base')) {
    function ds_render_base(array $args = []): string
    {
        ['heading' => $heading, 'text' => $text] = $args + [
            'heading' => 'Zażółć gęślą jaźń',
            'text' => 'Pchnąć w tę łódź jeża lub ośm skrzyń fig.',
        ];
        $headingText = ds_escape_html($heading);
        return '<main style="padding: var(--space-gutter)">
  <h1>' . $headingText . '</h1>
  <h2>' . $headingText . '</h2>
  <h3>' . $headingText . '</h3>
  <h4>' . $headingText . '</h4>
  <h5>' . $headingText . '</h5>
  <p>' . ds_escape_html($text) . ' <a href="#base">Link w tekście</a>, <code>var(--font-mono)</code>.</p>
</main>';
    }
}
