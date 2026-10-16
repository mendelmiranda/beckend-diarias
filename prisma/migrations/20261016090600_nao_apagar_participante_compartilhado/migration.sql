-- Ao excluir uma solicitação, não apagar participantes que também
-- pertencem a outra solicitação. O CASCADE em evento_participantes
-- disparava o bloqueio de solicitações com PDF_GERADO.

CREATE OR REPLACE FUNCTION public.remover_geral_darad(solicitacao_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Remove apenas participantes exclusivos desta solicitação.
    -- Quem também está em outra solicitação permanece.
    DELETE FROM participante AS p
    WHERE p.id IN (
        SELECT ep.participante_id
        FROM evento_participantes ep
        JOIN evento e ON e.id = ep.evento_id
        WHERE e.solicitacao_id = remover_geral_darad.solicitacao_id
    )
    AND NOT EXISTS (
        SELECT 1
        FROM evento_participantes ep_out
        JOIN evento e_out ON e_out.id = ep_out.evento_id
        WHERE ep_out.participante_id = p.id
          AND e_out.solicitacao_id <> remover_geral_darad.solicitacao_id
    )
    AND NOT EXISTS (
        SELECT 1
        FROM eventos_juntos ej
        WHERE ej.participante_id = p.id
          AND ej.solicitacao_id <> remover_geral_darad.solicitacao_id
    )
    AND NOT EXISTS (
        SELECT 1
        FROM valor_viagem vv
        JOIN viagem v ON v.id = vv.viagem_id
        WHERE vv.participante_id = p.id
          AND v.solicitacao_id IS DISTINCT FROM remover_geral_darad.solicitacao_id
    );

    DELETE FROM anexo_evento
    WHERE anexo_evento.evento_id IN (
        SELECT v.id
        FROM evento v
        WHERE v.solicitacao_id = remover_geral_darad.solicitacao_id
    );

    DELETE FROM evento
    WHERE evento.solicitacao_id = remover_geral_darad.solicitacao_id;

    DELETE FROM viagem_participantes
    WHERE viagem_participantes.viagem_id IN (
        SELECT v.id
        FROM viagem v
        WHERE v.solicitacao_id = remover_geral_darad.solicitacao_id
    );

    DELETE FROM viagem
    WHERE viagem.solicitacao_id = remover_geral_darad.solicitacao_id;

    DELETE FROM aprovacao_definitiva_daof
    WHERE aprovacao_definitiva_daof.solicitacao_id = remover_geral_darad.solicitacao_id;

    DELETE FROM aprovacao_definitiva
    WHERE aprovacao_definitiva.solicitacao_id = remover_geral_darad.solicitacao_id;

    DELETE FROM log_tramite
    WHERE log_tramite.tramite_id IN (
        SELECT v.id
        FROM tramite v
        WHERE v.solicitacao_id = remover_geral_darad.solicitacao_id
    );

    DELETE FROM tramite
    WHERE tramite.solicitacao_id = remover_geral_darad.solicitacao_id;

    DELETE FROM empenho_daofi
    WHERE empenho_daofi.solicitacao_id = remover_geral_darad.solicitacao_id;

    DELETE FROM solicitacao
    WHERE solicitacao.id = remover_geral_darad.solicitacao_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.remover_dados_por_solicitacao(solicitacao_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    DELETE FROM participante AS p
    WHERE p.id IN (
        SELECT ep.participante_id
        FROM evento_participantes ep
        JOIN evento e ON e.id = ep.evento_id
        WHERE e.solicitacao_id = remover_dados_por_solicitacao.solicitacao_id
    )
    AND NOT EXISTS (
        SELECT 1
        FROM evento_participantes ep_out
        JOIN evento e_out ON e_out.id = ep_out.evento_id
        WHERE ep_out.participante_id = p.id
          AND e_out.solicitacao_id <> remover_dados_por_solicitacao.solicitacao_id
    )
    AND NOT EXISTS (
        SELECT 1
        FROM eventos_juntos ej
        WHERE ej.participante_id = p.id
          AND ej.solicitacao_id <> remover_dados_por_solicitacao.solicitacao_id
    )
    AND NOT EXISTS (
        SELECT 1
        FROM valor_viagem vv
        JOIN viagem v ON v.id = vv.viagem_id
        WHERE vv.participante_id = p.id
          AND v.solicitacao_id IS DISTINCT FROM remover_dados_por_solicitacao.solicitacao_id
    );

    DELETE FROM evento
    WHERE evento.solicitacao_id = remover_dados_por_solicitacao.solicitacao_id;

    DELETE FROM viagem
    WHERE viagem.solicitacao_id = remover_dados_por_solicitacao.solicitacao_id;

    DELETE FROM viagem_participantes
    WHERE viagem_participantes.viagem_id IN (
        SELECT v.id
        FROM viagem v
        WHERE v.solicitacao_id = remover_dados_por_solicitacao.solicitacao_id
    );

    DELETE FROM solicitacao_condutores
    WHERE solicitacao_condutores.solicitacao_id = remover_dados_por_solicitacao.solicitacao_id;

    DELETE FROM solicitacao
    WHERE solicitacao.id = remover_dados_por_solicitacao.solicitacao_id;
END;
$function$;
