<?php
// Ranking Luna Calumbo. SQLite por defeito (zero configuração). Para MySQL troca a linha do PDO.
header('Content-Type: application/json; charset=utf-8');
$db = new PDO('sqlite:' . __DIR__ . '/../data/scores.db');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->exec('CREATE TABLE IF NOT EXISTS scores(id INTEGER PRIMARY KEY, name TEXT, score INT, site TEXT, ip TEXT, ts INT)');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $j = json_decode(file_get_contents('php://input'), true) ?: [];
  $name = mb_substr(trim(strip_tags($j['name'] ?? '')), 0, 20);
  $score = (int)($j['score'] ?? -1);
  $site = mb_substr(strip_tags($j['site'] ?? ''), 0, 40);
  if ($name === '' || $score < 0 || $score > 1000) { http_response_code(400); exit('{"error":"invalid"}'); }
  $ip = $_SERVER['REMOTE_ADDR'] ?? '';
  $q = $db->prepare('SELECT COUNT(*) FROM scores WHERE ip=? AND ts>?'); $q->execute([$ip, time() - 60]);
  if ($q->fetchColumn() >= 3) { http_response_code(429); exit('{"error":"rate"}'); }
  $db->prepare('INSERT INTO scores(name,score,site,ip,ts) VALUES(?,?,?,?,?)')->execute([$name, $score, $site, $ip, time()]);
}
echo json_encode($db->query('SELECT name,score,site FROM scores ORDER BY score DESC LIMIT 10')->fetchAll(PDO::FETCH_ASSOC));
