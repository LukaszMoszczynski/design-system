<?php
// Renders design-system PHP twins (components/<level>/<name>/<name>.template.php) for the parity test.
//
//   php scripts/php-render.php <component> '<json-args>' [renderFunction]
//       <component>: `atoms/button` or just `button`; renderFunction: the JS export name (default render<PascalName>,
//       e.g. renderButtonArrow for the round arrow). Prints the HTML.
//   php scripts/php-render.php --batch < cases.json
//       cases: [{ "component": "atoms/button", "function": "renderButton", "args": {…} }, …], rendered in order in one
//       process. Prints a JSON list of { "html": … } or { "error": … }.
//
// Every warning, notice or deprecation is an error, so a twin that only works by accident fails the test.
declare(strict_types=1);

const COMPONENTS_DIR = __DIR__ . '/../components';

set_error_handler(static function (int $severity, string $message, string $file, int $line): bool {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

function ds_render_cli_find_twin(string $component): string
{
    $component = trim(str_replace('\\', '/', $component), '/');
    $candidates = str_contains($component, '/') ? [$component] : array_map(
        static fn (string $level): string => $level . '/' . $component,
        ['atoms', 'molecules', 'organisms', 'sections']
    );
    if (!str_contains($component, '/')) {
        $candidates[] = $component; // base, _template
    }
    foreach ($candidates as $candidate) {
        $path = COMPONENTS_DIR . '/' . $candidate . '/' . basename($candidate) . '.template.php';
        if (is_file($path)) {
            return $path;
        }
    }
    throw new RuntimeException("no PHP twin for component {$component}");
}

// renderButtonArrow → ds_render_button_arrow.
function ds_render_cli_php_function(string $jsFunction): string
{
    $pascal = preg_replace('/^render/', '', $jsFunction);
    return 'ds_render_' . strtolower((string) preg_replace('/(?<!^)[A-Z]/', '_$0', (string) $pascal));
}

function ds_render_cli_default_function(string $component): string
{
    $name = basename(str_replace('\\', '/', $component));
    $pascal = str_replace(' ', '', ucwords(str_replace(['-', '_'], ' ', $name)));
    return 'render' . $pascal;
}

function ds_render_cli_one(string $component, string $jsFunction, array $args): string
{
    require_once ds_render_cli_find_twin($component);
    $function = ds_render_cli_php_function($jsFunction);
    if (!function_exists($function)) {
        throw new RuntimeException("{$function}() is not defined by the {$component} twin");
    }
    return $function($args);
}

function ds_render_cli_decode(string $json): mixed
{
    return json_decode($json, true, 512, JSON_THROW_ON_ERROR);
}

$arguments = array_slice($argv, 1);

if (($arguments[0] ?? '') === '--batch') {
    $cases = ds_render_cli_decode((string) stream_get_contents(STDIN));
    $results = [];
    foreach ($cases as $case) {
        try {
            $results[] = ['html' => ds_render_cli_one($case['component'], $case['function'], (array) ($case['args'] ?? []))];
        } catch (Throwable $error) {
            $where = basename($error->getFile()) . ':' . $error->getLine();
            $results[] = ['error' => get_class($error) . ': ' . $error->getMessage() . " ({$where})"];
        }
    }
    echo json_encode($results, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    exit(0);
}

if (count($arguments) < 1) {
    fwrite(STDERR, "usage: php scripts/php-render.php <component> '<json-args>' [renderFunction] | --batch < cases.json\n");
    exit(2);
}

$component = $arguments[0];
$args = isset($arguments[1]) ? (array) ds_render_cli_decode($arguments[1]) : [];
$jsFunction = $arguments[2] ?? ds_render_cli_default_function($component);
echo ds_render_cli_one($component, $jsFunction, $args), "\n";
