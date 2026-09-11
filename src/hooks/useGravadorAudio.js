import { useCallback, useRef, useState } from "react";

/**
 * Grava áudio do microfone via MediaRecorder.
 *
 * - `iniciar()`  pede permissão e começa a gravar (retorna true/false)
 * - `parar()`    para e resolve com o Blob do áudio
 * - `erroPermissao` fica true se o usuário negar o microfone
 */
export function useGravadorAudio() {
  const [gravando, setGravando] = useState(false);
  const [erroPermissao, setErroPermissao] = useState(false);

  const gravadorRef = useRef(null);
  const streamRef = useRef(null);
  const pedacosRef = useRef([]);

  const iniciar = useCallback(async () => {
    setErroPermissao(false);

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setErroPermissao(true);
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      pedacosRef.current = [];

      const gravador = new MediaRecorder(stream);
      gravador.ondataavailable = (evento) => {
        if (evento.data?.size) pedacosRef.current.push(evento.data);
      };
      gravador.start();

      gravadorRef.current = gravador;
      setGravando(true);
      return true;
    } catch {
      setErroPermissao(true);
      return false;
    }
  }, []);

  const encerrarStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((faixa) => faixa.stop());
    streamRef.current = null;
  }, []);

  const parar = useCallback(() => {
    return new Promise((resolve) => {
      const gravador = gravadorRef.current;
      if (!gravador || gravador.state === "inactive") {
        setGravando(false);
        encerrarStream();
        resolve(null);
        return;
      }

      gravador.onstop = () => {
        const blob = new Blob(pedacosRef.current, {
          type: gravador.mimeType || "audio/webm",
        });
        encerrarStream();
        setGravando(false);
        resolve(blob);
      };
      gravador.stop();
    });
  }, [encerrarStream]);

  const cancelar = useCallback(() => {
    const gravador = gravadorRef.current;
    if (gravador && gravador.state !== "inactive") {
      gravador.onstop = null;
      gravador.stop();
    }
    encerrarStream();
    setGravando(false);
  }, [encerrarStream]);

  return { gravando, erroPermissao, iniciar, parar, cancelar };
}
