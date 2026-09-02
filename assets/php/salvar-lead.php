<?php
/**
 * Recebe o POST JSON dos dois formulários do site (popup do Técnico e
 * "Seja um distribuidor" do Lojista) e grava cada envio como uma linha
 * num CSV local, em assets/php/leads/ — sem depender de nenhum serviço
 * externo. Essa pasta é protegida por .htaccess (ninguém baixa o CSV
 * pela URL), mas o PHP, rodando no servidor, lê e escreve nela normal.
 */

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'erro' => 'method_not_allowed']);
    exit;
}

$corpo = file_get_contents('php://input');
$lead = json_decode($corpo, true);

if (!is_array($lead) || empty($lead['nome']) || empty($lead['data'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'erro' => 'payload_invalido']);
    exit;
}

/** Corta em N caracteres e limpa quebra de linha, sem travar em multibyte. */
function limpar($valor, $max = 300) {
    $valor = (string) $valor;
    $valor = str_replace(["\r", "\n"], ' ', $valor);
    return mb_substr(trim($valor), 0, $max);
}

/** Evita CSV injection: se abrir com =,+,-,@ o Excel/Sheets pode tratar
 *  como fórmula ao abrir o arquivo — prefixa com aspas simples. */
function defang($valor) {
    if ($valor !== '' && preg_match('/^[=+\-@]/', $valor)) {
        return "'" . $valor;
    }
    return $valor;
}

function campo($valor) {
    return defang(limpar($valor));
}

$ehDistribuidor = isset($lead['email']);
$pastaLeads = __DIR__ . '/leads';
if (!is_dir($pastaLeads)) {
    mkdir($pastaLeads, 0755, true);
}

if ($ehDistribuidor) {
    $arquivo = $pastaLeads . '/seja-distribuidor.csv';
    $cabecalho = ['Data', 'Nome', 'Telefone', 'E-mail', 'CEP', 'Cidade/UF', 'Faixa de compra', 'Página'];
    $linha = [
        campo($lead['data']),
        campo($lead['nome']),
        campo($lead['telefoneFmt'] ?? $lead['telefone'] ?? ''),
        campo($lead['email'] ?? ''),
        campo($lead['cep'] ?? ''),
        campo($lead['cidadeUf'] ?? ''),
        campo($lead['faixaCompra'] ?? ''),
        campo($lead['origem'] ?? ''),
    ];
} else {
    $arquivo = $pastaLeads . '/libera-mapa.csv';
    $cabecalho = ['Data', 'Nome', 'WhatsApp', 'Perfil', 'Página'];
    $linha = [
        campo($lead['data']),
        campo($lead['nome']),
        campo($lead['whatsappFmt'] ?? $lead['whatsapp'] ?? ''),
        campo($lead['perfil'] ?? ''),
        campo($lead['origem'] ?? ''),
    ];
}

$fh = fopen($arquivo, 'a');
if (!$fh) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'erro' => 'nao_foi_possivel_gravar']);
    exit;
}

/* Checa o tamanho só depois do lock, pra dois envios simultâneos nunca
   escreverem o cabeçalho duas vezes. */
flock($fh, LOCK_EX);
$stat = fstat($fh);
if ($stat['size'] === 0) {
    fputcsv($fh, $cabecalho);
}
fputcsv($fh, $linha);
flock($fh, LOCK_UN);
fclose($fh);

echo json_encode(['ok' => true]);
