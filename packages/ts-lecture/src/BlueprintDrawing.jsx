import React from 'react';

export function BlueprintDrawing() {
  return <figure className="blueprint-drawing">
    <div className="drawing-caption"><span>СХЕМА 01</span><span>ОТ ТИПОВ К ВЫПОЛНЕНИЮ</span></div>
    <svg viewBox="0 0 600 450" role="img" aria-labelledby="blueprint-title blueprint-description">
      <title id="blueprint-title">TypeScript, контракт и JavaScript</title>
      <desc id="blueprint-description">Три разнесённых слоя: исходник TS, проверяемый контракт и выполняемый JavaScript. Выносные линии связывают слои.</desc>
      <defs>
        <pattern id="plate-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(28)"><path d="M0 0V7" stroke="currentColor" strokeWidth=".6" /></pattern>
        <marker id="dimension-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M9 1L1 5L9 9" fill="none" stroke="currentColor" strokeWidth="1" /></marker>
      </defs>
      <g className="construction-lines" fill="none">
        <path d="M34 182L397 38M34 402L566 191M72 443L566 247M96 149L96 421M489 39L489 345M554 88L554 367" />
        <path d="M74 174L489 338" />
      </g>
      <g className="drawing-plate plate-back">
        <path d="M386 102L516 154L516 348L386 296Z" />
        <path className="plate-edge" d="M386 102L398 96L528 148L528 342L516 348M516 154L528 148" />
        <g transform="matrix(1 .4 0 1 401 146)"><path className="plate-rule" d="M0 0H98M0 15H47" /><text className="plate-letters" x="0" y="120">JS</text><text className="plate-footnote" x="0" y="155">ВЫПОЛНЕНИЕ</text></g>
      </g>
      <g className="drawing-plate plate-middle">
        <path d="M238 148L368 200L368 394L238 342Z" />
        <path className="plate-edge" d="M238 148L250 142L380 194L380 388L368 394M368 200L380 194" />
        <g transform="matrix(1 .4 0 1 255 192)"><path className="plate-rule" d="M0 0H96M0 15H43" /><text className="plate-braces" x="0" y="115">{'{ }'}</text><text className="plate-footnote" x="0" y="155">КОНТРАКТ</text></g>
      </g>
      <g className="drawing-plate plate-front">
        <path d="M90 194L220 246L220 440L90 388Z" />
        <path className="plate-hatching" d="M90 194L220 246L220 440L90 388Z" />
        <path className="plate-edge" d="M90 194L102 188L232 240L232 434L220 440M220 246L232 240" />
        <g transform="matrix(1 .4 0 1 106 235)"><path className="plate-rule" d="M0 0H98M0 15H45" /><text className="plate-letters" x="0" y="120">TS</text><text className="plate-footnote" x="0" y="155">ИСХОДНИК</text></g>
      </g>
      <g className="dimension-lines" fill="none">
        <path d="M65 194V388" markerStart="url(#dimension-arrow)" markerEnd="url(#dimension-arrow)" />
        <path d="M57 194H82M57 388H82M102 173L514 14" />
        <path d="M102 168V183M514 9V24" />
      </g>
      <g className="diagram-callouts" fill="none">
        <path d="M178 221L178 94L215 76H296" /><circle cx="178" cy="221" r="4" />
        <path d="M336 224L421 68H492" /><circle cx="336" cy="224" r="4" />
      </g>
      <g className="callout-text"><text x="215" y="48">ОПИСЫВАЕМ</text><text x="215" y="65">ДАННЫЕ</text><text x="423" y="42">ПРОВЕРЯЕМ</text><text x="423" y="59">КОНТРАКТ</text></g>
      <g className="drawing-crosses" fill="none"><path d="M80 194H100M90 184V204M376 102H396M386 92V112M506 348H526M516 338V358" /></g>
    </svg>
    <figcaption><span>01 / ИСХОДНИК</span><span>02 / КОНТРАКТ</span><span>03 / РЕЗУЛЬТАТ</span></figcaption>
  </figure>;
}
