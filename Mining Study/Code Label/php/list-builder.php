<?php

function get_sanitized_param_num($name, $default = 0): float
{
    $param = $_GET[$name] ?? $default;
    return (float)preg_replace('/[^0-9]/', '', $param);
}

function get_icon_csv_listing_html($icon): string
{
    $id = htmlspecialchars($icon->id);
    $filename = htmlspecialchars($icon->filename);
    $src = "/resources/png/icon/$filename";
    $deleteLink = "/inventory/icon/delete/?id=$id";

    $html = <<<HTML
<tr>
    <td>{$id}</td>
    <td><img class="internal-icon-csv" src="{$src}"></td>
    <td>{$filename}</td>
    <td><a href="{$deleteLink}">Delete</a></td>
</tr>
HTML;

    return $html;
}

function get_tag_csv_listing_html($tag): string
{
    $id = htmlspecialchars($tag->id);
    $text = htmlspecialchars($tag->text);
    $deleteLink = "/inventory/tag/delete/?id=$id";

    $html = <<<HTML
<tr>
    <td>{$id}</td>
    <td>{$text}</td>
    <td><a href="{$deleteLink}">Delete</a></td>
</tr>
HTML;

    return $html;
}

function get_csv_listing_html($game, $edit_link): string
{
    $start = '<tr>';
    $content = '<td>';
    if ($edit_link) {
        $content .= '<a href="/inventory/game/edit/?id=' . $game->id . '">' . $game->title . '</a>';
    } else {
        $content .= $game->title;
    }
    $content .= '</td><td>' . $game->year . '</td>';
    $content .= '<td>' . $game->platform . '</td>';
    $content .= '<td>' . $game->company . '</td>';
    $content .= '<td>' . $game->rating . '</td>';
    $content .= '<td>' . $game->hours . '</td>';
    $content .= '<td>' . $game->playthroughs . '</td>';
    $content .= '<td>' . var_export($game->hundo, true) . '</td>';
    $content .= '<td>' . var_export($game->plat, true) . '</td>';
    $content .= '<td>' . var_export($game->dlc, true) . '</td>';
    $content .= '<td>' . var_export($game->physical, true) . '</td>';
    $content .= '<td>' . $game->iconid . '</td>';
    $end = '</tr>';

    return $start . $content . $end;
}

function get_compact_listing_html($game): string
{
    $iconfile = $game->iconfile !== '' ? $game->iconfile : 'default-icon.png';
    $id = htmlspecialchars($game->id);
    $title = htmlspecialchars($game->title);
    $rating = $game->get_rating_html();
    $year = htmlspecialchars($game->year);
    $platform = htmlspecialchars($game->platform);
    $returnPage = get_sanitized_param_num('p', 0);
    $returnLimit = get_sanitized_param_num('l', 10);

    $html = <<<HTML
<div class="game-listing compact" onclick="window.location.href='/game/?id={$id}&p={$returnPage}&l={$returnLimit}'">
    <div class="game-icon">
        <img src="/resources/png/icon/{$iconfile}">
    </div>
    <div class="game-details">
        <div class="game-title">{$title}</div>
        <div class="rating">{$rating}</div>
        <div class="subtext">{$year}, {$platform}</div>
    </div>
</div>
HTML;

    return $html;
}

function get_listing_html($type, $edit_link = false): string
{
    require 'game-fetcher.php';
    $html = '';
    $all_games = get_all_games(get_sanitized_param_num('l', 10), get_sanitized_param_num('p', 0));

    switch ($type) {
        case 'csv':
            $html = '<table class="csv-table"><tr>
                <th>Title</th><th>Year</th><th>Platform</th><th>Company</th><th>Rating</th>
                <th>Hours</th><th>Playthroughs</th><th>100%</th><th>Plat</th><th>DLC</th><th>Physical</th>
                <th>Icon</th></tr>';
            foreach ($all_games as $game) {
                $html .= get_csv_listing_html($game, $edit_link);
            }
            $html .= '</table>';
            break;

        case 'compact':
            foreach ($all_games as $game) {
                $html .= get_compact_listing_html($game);
            }
            break;
    }

    return $html;
}

function get_icon_grid_html($icon, $gameid): string
{
    $iconId = htmlspecialchars($icon->id);
    $filename = htmlspecialchars($icon->filename);
    $gameid = htmlspecialchars($gameid);

    $link = $gameid === 'new' 
        ? "/inventory/game/new/?icon={$iconId}&file={$filename}" 
        : "/inventory/game/edit/?id={$gameid}&icon={$iconId}&file={$filename}";

    $html = <<<HTML
<div>
    <a href="{$link}">
        <img class="icon-grid-icon" src="/resources/png/icon/{$filename}">
    </a>
</div>
HTML;

    return $html;
}

function get_icon_listing_html($type = 'default', $gameid = -1): string
{
    require 'icon-fetcher.php';
    $html = '';
    $all_icons = get_all_icons(get_sanitized_param_num('l', 10), get_sanitized_param_num('p', 0));

    switch ($type) {
        case 'default':
            $html = '<table class="csv-table"><tr><th>ID</th><th>Image</th><th>File Name</th><th>Actions</th></tr>';
            foreach ($all_icons as $icon) {
                $html .= get_icon_csv_listing_html($icon);
            }
            $html .= '</table>';
            break;

        case 'grid':
            if ($gameid !== -1) {
                foreach ($all_icons as $icon) {
                    $html .= get_icon_grid_html($icon, $gameid);
                }
            } else {
                $html = '<p>Invalid icon listing parameters!</p>';
            }
            break;

        default:
            $html = '<p>Invalid icon listing parameters!</p>';
            break;
    }

    return $html;
}


function get_tag_listing_html(): string
{
    require 'tag-fetcher.php';
    $all_tags = get_all_tags();
    $html = '<table class="csv-table"><tr><th>ID</th><th>Text</th><th>Actions</th></tr>';
    foreach ($all_tags as $tag) {
        $html .= get_tag_csv_listing_html($tag);
    }
    $html .= '</table>';

    return $html;
}

function get_page_navigation_html($url): void
{
    // modified code generated by github copilot
    $page = get_sanitized_param_num('p', 0);
    $limit = get_sanitized_param_num('l', 10);
    $last_page = ($_SESSION['game_count'] - fmod($_SESSION['game_count'], $limit)) / $limit;

    $html = '<div class="page-navigation">';

    // First page link
    $html .= '<span>' . ($page > 0 ? '<a href="' . $url . '?p=0&l=' . $limit . '">First</a>' : 'First') . '</span>';

    // Page numbers
    for ($i = max(0, $page - 1); $i <= min($last_page, $page + 1); $i++) {
        $html .= '<span>' . ($i == $page ? $i + 1 : '<a href="' . $url . '?p=' . $i . '&l=' . $limit . '">' . ($i + 1) . '</a>') . '</span>';
    }

    // Last page link
    $html .= '<span>' . ($page < $last_page ? '<a href="' . $url . '?p=' . $last_page . '&l=' . $limit . '">Last</a>' : 'Last') . '</span>';

    $html .= '
    <span>
        <select name="resultnumdropdown" id="resultnumdropdown">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="35">35</option>
            <option value="50">50</option>
        </select>
        <span style="font-size:13px">Results per page</span>
    </span>';

    $html .= '</div>';

    echo $html;
}

function get_page_navigation_html_icon($url): void
{
    // modified code generated by github copilot
    $page = get_sanitized_param_num('p', 0);
    $limit = get_sanitized_param_num('l', 10);
    $last_page = ($_SESSION['icon_count'] - fmod($_SESSION['icon_count'], $limit)) / $limit;

    $html = '<div class="page-navigation">';

    // First page link
    $_GET['p'] = 0;
    $html .= '<span>' . ($page > 0 ? '<a href="' . $url . '?' . http_build_query($_GET) . '">First</a>' : 'First') . '</span>';

    // Page numbers
    for ($i = max(0, $page - 1); $i <= min($last_page, $page + 1); $i++) {
        $_GET['p'] = $i;
        $html .= '<span>' . ($i == $page ? $i + 1 : '<a href="' . $url . '?' . http_build_query($_GET) . '">' . ($i + 1) . '</a>') . '</span>';
    }

    // Last page link
    $_GET['p'] = $last_page;
    $html .= '<span>' . ($page < $last_page ? '<a href="' . $url . '?' . http_build_query($_GET) . '">Last</a>' : 'Last') . '</span>';

    $html .= '
    <span>
        <select name="resultnumdropdown" id="resultnumdropdown">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="35">35</option>
            <option value="50">50</option>
        </select>
        <span style="font-size:13px">Results per page</span>
    </span>';

    $html .= '</div>';

    echo $html;
}
