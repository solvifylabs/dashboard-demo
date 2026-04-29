import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { usePrintOrder, usePrintServiceStatus } from "../use-print-order";

// ---------------------------------------------------------------------------
// Helpers de wrapper
// ---------------------------------------------------------------------------

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    ),
    qc,
  };
}

function createWrapperWithCache(key: string[], data: unknown) {
  const qc = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  qc.setQueryData(key, data);
  return {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    ),
    qc,
  };
}

// ---------------------------------------------------------------------------
// SPEC-10: usePrintOrder
// ---------------------------------------------------------------------------

describe("usePrintOrder", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("lanza error cuando el servicio no está disponible (isAvailable=false) y no llama a fetch", async () => {
    const { wrapper } = createWrapperWithCache(["print-service-status"], {
      isAvailable: false,
    });

    const { result } = renderHook(() => usePrintOrder(), { wrapper });

    await expect(
      act(() => result.current.mutateAsync("order-123"))
    ).rejects.toThrow("El servicio de impresión no está disponible");

    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });

  it("llama a fetch POST cuando el servicio está disponible y retorna el json", async () => {
    const mockResponse = { success: true };
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });
    vi.stubGlobal("fetch", mockFetch);

    const { wrapper } = createWrapperWithCache(["print-service-status"], {
      isAvailable: true,
    });

    const { result } = renderHook(() => usePrintOrder(), { wrapper });

    let response: unknown;
    await act(async () => {
      response = await result.current.mutateAsync("order-123");
    });

    expect(mockFetch).toHaveBeenCalledWith("http://localhost:3001/print", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: "order-123" }),
    });
    expect(response).toEqual(mockResponse);
  });

  it("lanza el texto del error cuando fetch retorna !ok con texto", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      text: async () => "Impresora desconectada",
    });
    vi.stubGlobal("fetch", mockFetch);

    const { wrapper } = createWrapperWithCache(["print-service-status"], {
      isAvailable: true,
    });

    const { result } = renderHook(() => usePrintOrder(), { wrapper });

    await expect(
      act(() => result.current.mutateAsync("order-123"))
    ).rejects.toThrow("Impresora desconectada");
  });

  it("lanza mensaje genérico cuando fetch retorna !ok con texto vacío", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      text: async () => "",
    });
    vi.stubGlobal("fetch", mockFetch);

    const { wrapper } = createWrapperWithCache(["print-service-status"], {
      isAvailable: true,
    });

    const { result } = renderHook(() => usePrintOrder(), { wrapper });

    await expect(
      act(() => result.current.mutateAsync("order-123"))
    ).rejects.toThrow("Error al imprimir el pedido");
  });
});

// ---------------------------------------------------------------------------
// SPEC-11: usePrintServiceStatus
// ---------------------------------------------------------------------------

describe("usePrintServiceStatus", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("isAvailable=true y version correcta cuando fetch responde con ok y version", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ version: "1.2.3" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { wrapper } = createWrapper();

    const { result } = renderHook(() => usePrintServiceStatus(), { wrapper });

    await waitFor(() => {
      expect(result.current.isAvailable).toBe(true);
    });
    expect(result.current.version).toBe("1.2.3");
  });

  it("isAvailable=false y no lanza cuando fetch rechaza con Network Error", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error("Network Error"));
    vi.stubGlobal("fetch", mockFetch);

    const { wrapper } = createWrapper();

    const { result } = renderHook(() => usePrintServiceStatus(), { wrapper });

    await waitFor(() => {
      expect(result.current.isAvailable).toBe(false);
    });
  });
});
