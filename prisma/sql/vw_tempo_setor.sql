-- Tempo de permanência de cada solicitação em cada setor (lotação).
-- A lista de solicitações é aplicada na consulta (WHERE solicitacao_id IN (...)),
-- não dentro da view.

CREATE OR REPLACE VIEW vw_tempo_setor AS
WITH movs AS (
    SELECT t.solicitacao_id,
           lt.id AS log_id,
           lt.cod_lotacao_origem,
           lt.lotacao_origem,
           lt.cod_lotacao_destino,
           lt.lotacao_destino,
           lt.status,
           lt.nome AS usuario,
           lt.datareg
    FROM log_tramite lt
    JOIN tramite t ON t.id = lt.tramite_id

    UNION ALL

    SELECT t.solicitacao_id,
           NULL::int,
           t.cod_lotacao_origem,
           t.lotacao_origem,
           t.cod_lotacao_destino,
           t.lotacao_destino,
           t.status,
           NULL::text,
           t.datareg
    FROM tramite t
    WHERE NOT EXISTS (
        SELECT 1 FROM log_tramite lt WHERE lt.tramite_id = t.id
    )
),
seq AS (
    SELECT m.*,
           ROW_NUMBER() OVER w AS ordem,
           LEAD(m.datareg) OVER w AS saida
    FROM movs m
    WINDOW w AS (
        PARTITION BY m.solicitacao_id
        ORDER BY m.datareg, m.log_id NULLS FIRST
    )
),
periodos AS (
    SELECT s.solicitacao_id,
           0 AS ordem,
           s.cod_lotacao_origem AS cod_lotacao,
           s.lotacao_origem AS lotacao,
           'CRIACAO'::text AS status,
           NULL::text AS usuario,
           so.datareg AS entrada,
           s.datareg AS saida
    FROM seq s
    JOIN solicitacao so ON so.id = s.solicitacao_id
    WHERE s.ordem = 1

    UNION ALL

    SELECT solicitacao_id,
           ordem,
           cod_lotacao_destino,
           lotacao_destino,
           status,
           usuario,
           datareg,
           saida
    FROM seq
)
SELECT p.solicitacao_id,
       so.protocolo,
       so.status AS status_atual_solicitacao,
       p.ordem,
       p.cod_lotacao,
       p.lotacao,
       p.status AS status_tramite,
       p.usuario,
       p.entrada,
       COALESCE(p.saida, now()) AS saida,
       (p.saida IS NULL) AS em_andamento,
       COALESCE(p.saida, now()) - p.entrada AS tempo
FROM periodos p
JOIN solicitacao so ON so.id = p.solicitacao_id;
