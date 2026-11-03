<?php
// PHP twin of model-word.template.js: the model word as a row of overlapping letter circles; `active` is a letter index.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/values.php';
require_once __DIR__ . '/../../atoms/number/number.template.php';

if (!function_exists('ds_render_model_word')) {
    function ds_render_model_word(array $args = []): string
    {
        ['word' => $word, 'active' => $active] = $args + ['word' => 'EVOLUTION', 'active' => -1];
        $activeIndex = ds_number($active); // JS Number(active); NAN matches no letter
        $letters = '';
        foreach (mb_str_split(ds_string($word)) as $index => $letter) {
            $letters .= ds_render_letter_circle(['text' => $letter, 'variant' => 'word', 'active' => $index == $activeIndex]);
        }
        return '<p class="ds-model-word" aria-hidden="true">' . $letters . '</p>';
    }
}
