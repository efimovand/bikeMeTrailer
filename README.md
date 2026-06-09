# 🏍️ BikeMe — Promo Trailer

> Премиальный промо-трейлер в стиле **Apple Keynote**, собранный целиком кодом.
> React + TypeScript → покадровый рендер → MP4. Без таймлайн-редакторов.

![Remotion](https://img.shields.io/badge/Remotion-4.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Format](https://img.shields.io/badge/1080%C3%971920-30fps-orange)
![Duration](https://img.shields.io/badge/duration-30.4s-lightgrey)

**BikeMe** — Telegram-бот, который по 3 фото пользователя генерирует фотореалистичный кадр: человек на выбранном мотоцикле в выбранной экипировке. Трейлер показывает весь путь — от загрузки фото до результата — и закрывается оффером для мотомагазинов (white-label примерочная под их бренд).

---

## 🎬 Сюжет (30.4 сек)

| # | Сцена | Что происходит |
|---|-------|----------------|
| 1 | **Intro** | TG-строка ввода → клик по скрепке → фото загружено |
| 2 | **BikePick** | CS-кейс-рулетки: бренды → BMW, силуэты → S1000RR |
| 3 | **Select** | Сбор сетапа: куртка ✓, шлем ✓ |
| 4 | **ColorScroll** | 3D-изометрический скролл расцветок AGV K1-S + клик |
| 5 | **Result** | Карточка-результат: «Примерь на себя.» |
| 6 | **ResultsFan** | Стена из 17 AI-генераций → морф в карточку |
| 7 | **Deck** | Cover-flow: «Любой байк. Любой стиль.» |
| 8 | **Device** | Отъезд камеры в iPhone — «Примерочная — прямо в Telegram.» |
| 9 | **Outro** | Лого → ребрендинг «BikeMeBot → Ваш магазин» → цены и контакт |

## 🚀 Быстрый старт

```bash
npm install
npm run dev          # Remotion Studio — превью со скрабингом
```

**Рендер:**

```bash
# стилл для проверки кадра
npx remotion still Trailer out/test.png --frame=N

# финальный MP4 (макс. качество, совместим со всеми плеерами)
npx remotion render Trailer out/trailer.mp4 \
  --codec=h264 --crf=16 --image-format=png \
  --pixel-format=yuv420p --color-space=bt709
```

## 🗂 Структура

```
src/
├── Root.tsx              # композиция Trailer (913 кадров, 1080×1920, 30fps)
├── Trailer.tsx           # TransitionSeries: сцены + переходы
├── scenes/               # 9 сцен (Scene1Intro … Scene6Outro)
├── transitions/
│   └── zoomThrough.tsx   # фирменный переход: наплыв из глубины + blur
└── components/
    └── MacCursor.tsx     # курсор macOS (inline SVG)

public/                   # все ассеты: генерации, силуэты, расцветки, девайс
```

## 🎨 Дизайн-система («эппловость»)

- Фон почти-чёрный `#0F1923`, много воздуха
- Один акцентный цвет — оранжевый `#E8660A`, точечно
- Шрифт **Inter** (300 / 600-700), крупно, минимум слов
- Изинги только `Easing.out` / `Easing.inOut` / `spring` — никогда linear
- Глубина: параллакс, мягкие тени, блюр на переходах
- Медленный уверенный темп

## ⚙️ Технические заметки

- Переходы «съедают» кадры: `durationInFrames = Σ сцен − Σ переходов`. При изменении длительностей — пересчитать в `Root.tsx`.
- Сцены связаны геометрией: морф-карта `SceneResultsFan` пиксель-в-пиксель садится в карточку `Scene4Deck` (`TGT_* ↔ CARD_W/H`).
- `filter` на элементе с `overflow:hidden + border-radius` мылит картинку — соседние карточки Deck димятся оверлеем.
- Отсутствующий ассет (404) роняет весь рендер — имена файлов сверять с `public/`.

Подробная документация для разработки — в [CLAUDE.md](CLAUDE.md).

---

**Контакт:** Андрей Ефимов · [@efimov_and](https://t.me/efimov_and)
