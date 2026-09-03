# AMOC-Kipppunkt

[![GenesisAeon](https://img.shields.io/badge/GenesisAeon-P18-blue)](https://github.com/GenesisAeon/amoc-utac)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Interaktive Physik-Sandbox der Atlantischen Umwälzzirkulation (AMOC). Die ODE
kommt aus dem kalibrierten Paket [amoc-utac](https://github.com/GenesisAeon/amoc-utac)
(GenesisAeon P18) — keine erfundenen Zahlen.

## Gleichung

Aus `amoc_utac/system.py` / `tipping_predictor.py`:

```
H*     = K · tanh(σ · Γ)
dH/dt  = r · H · (H*/K − H/K)
```

Kalibrierung (`amoc_utac/constants.py`):

| Größe | Wert | Quelle |
|---|---|---|
| σ | 2,2 | CREP-Kopplung |
| r | 0,08 a⁻¹ | intrinsische Erholrate |
| K | 18 Sv | Kapazität / RAPID-Gegenwart |
| Γ_AMOC | arctanh(0,50) / 2,2 ≈ 0,251 | 50 %-Schwächungs-Sollwert |
| RAPID-Mittel | 17 ± 4 Sv | Array 2004–2023 |
| Fov_ref | 0,1 Sv | Sigmoid-Normierung |
| α | −0,05 | Fov–AMOC-Koeffizient |

Γ setzt sich wie in `crep_amoc.py` zusammen:

```
Γ = 0,30 C + 0,35 R + 0,20 E + 0,15 (1 − P)
```

Der Schieberegler steuert Extra-Hosing F, addiert auf das heutige Fov
(`freshwater.py`: Fov ≈ α · Ψ · ΔS / S₀). Bei F = 0 bleibt Γ = Γ_AMOC.

## Zwei Modi

- **UTAC-Logistik** — die echte Paket-ODE. Ein Attraktor H\*; H = 0 ist
  absorbierend (ohne Anstoß keine Erholung).
- **Bistabile Falte** — pädagogische Sattel-Knoten-Normalform, skaliert nur
  mit K, r und Fov_ref (Falten bei ±0,1 Sv). Zeigt die Hysterese dieses
  Systemtyps. **Keine** kalibrierte AMOC-Vorhersage.

## Kontext, keine Vorhersage dieser Sandbox

Die Zeitachse markiert Ditlevsen & Ditlevsen **2065 [2037–2109]** (Author
Correction 2025, DOI [10.1038/s41467-025-63201-y](https://doi.org/10.1038/s41467-025-63201-y))
und die IPCC-AR6-Position (SPM C.3.4): *medium confidence that the Atlantic
Meridional Overturning Circulation will not collapse abruptly before 2100*.

Beides ist Kontext, nicht das Ergebnis der UTAC-ODE hier. „Medium confidence“
ist keine Wahrscheinlichkeitszahl. Ditlevsen ist eine Einzelstudie, nicht der
IPCC-Konsens. Morr et al. (2026, arXiv:2604.20341, Preprint) kritisieren die
Fingerprint-Wahl als fragil.

Fov-Frühwarnung: van Westen, Kliphuis & Dijkstra (2024),
DOI [10.1126/sciadv.adk1189](https://doi.org/10.1126/sciadv.adk1189).

## Lokal starten

Voraussetzung: Node.js 22+.

```bash
git clone https://github.com/GenesisAeon/amoc-kipppunkt.git
cd amoc-kipppunkt
npm install
npm run dev
```

```bash
npm run build
npm run typecheck
```

## Auth (derzeit ungenutzt)

Das Scaffolding unter `src/lib/auth` (better-auth, PGlite) ist **nicht aktiv**.
Keine Konten, keine Login-Seite, keine serverseitigen Nutzerdaten.

## Lizenz

[MIT](LICENSE). Passend zum Rest des GenesisAeon-Ökosystems und zu
[amoc-utac](https://github.com/GenesisAeon/amoc-utac) (MIT).
