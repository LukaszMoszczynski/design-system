<?php
// PHP twin of model-step.template.js: a model step (letter circle, bold term, text) and the list of steps.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../../atoms/number/number.template.php';

defined('DS_MODEL_STEP_DEFAULTS') || define('DS_MODEL_STEP_DEFAULTS', [
    ['letter' => 'E', 'term' => "EXPERT'S LOOK", 'text' => 'Rzetelnie diagnozujemy sytuację. Rozmawiamy z właścicielami, HR, zarządem i określamy istotę problemu.'],
    ['letter' => 'V', 'term' => 'VISION', 'text' => 'Razem ustalamy, dokąd zmierza zespół i po czym poznamy, że jest lepiej.'],
    ['letter' => 'O', 'term' => 'OPTIONS', 'text' => 'Dobieramy formy pracy: warsztaty, coaching, mentoring albo ich połączenie.'],
]);

if (!function_exists('ds_render_model_step')) {
    function ds_render_model_step(array $args = []): string
    {
        $first = DS_MODEL_STEP_DEFAULTS[0];
        ['letter' => $letter, 'term' => $term, 'text' => $text, 'active' => $active] = $args + [
            'letter' => $first['letter'], 'term' => $first['term'], 'text' => $first['text'], 'active' => false,
        ];
        $termMarkup = ds_truthy($term) ? '<strong>' . ds_escape_html($term) . '</strong> ' : '';
        return '<li class="ds-model-step' . (ds_truthy($active) ? ' is-active' : '') . '"><span class="ds-model-step__letter" aria-hidden="true">' . ds_render_letter_circle(['text' => $letter, 'variant' => 'step', 'active' => $active]) . '</span><p class="ds-model-step__text">' . $termMarkup . ds_escape_html($text) . '</p></li>';
    }
}

if (!function_exists('ds_render_model_steps')) {
    function ds_render_model_steps(array $args = []): string
    {
        ['items' => $items] = $args + ['items' => DS_MODEL_STEP_DEFAULTS];
        return '<ol class="ds-model-steps" role="list">' . implode('', array_map('ds_render_model_step', array_values($items))) . '</ol>';
    }
}
