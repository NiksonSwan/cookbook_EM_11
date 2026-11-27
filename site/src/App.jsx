import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import borschPhoto from '../../images/borsch.png'
import syrnikiPhoto from '../../images/syrniki.png'

const steps = [
  { title: 'Начни с бульона', ingredient: 'Говядина + вода', time: 'До готовности мяса', text: 'Залей говядину двумя литрами воды. Вари до мягкости, затем достань мясо и нарежь его. Это основа вкуса.' },
  { title: 'Добавь картофель', ingredient: 'Картофель', time: '10 минут', text: 'Нарежь картофель и отправь его в кипящий бульон. Дай ему десять минут, прежде чем добавлять капусту.' },
  { title: 'Теперь капуста', ingredient: 'Капуста', time: 'До мягкости', text: 'Нашинкуй капусту и добавь к картофелю. Пока овощи варятся, самое время заняться зажаркой.' },
  { title: 'Сделай зажарку', ingredient: 'Лук + морковь', time: 'Несколько минут', text: 'Обжарь лук и морковь на растительном масле. Овощи должны стать мягкими и ароматными.' },
  { title: 'Придай цвет', ingredient: 'Свёкла + томат', time: '10 минут', text: 'Добавь натёртую свёклу и томатную пасту к зажарке. Потуши вместе — именно здесь появляется насыщенный цвет.' },
  { title: 'Собери борщ', ingredient: 'Мясо + зажарка', time: '10 минут + отдых', text: 'Переложи зажарку и мясо в кастрюлю. Приправь, провари ещё десять минут и дай борщу настояться под крышкой.' },
]

const shopping = [
  ['Говядина', '400 г'], ['Вода', '2 л'], ['Свёкла', '1 шт.'],
  ['Картофель', '3 шт.'], ['Капуста', '250 г'], ['Морковь', '1 шт.'],
  ['Лук', '1 шт.'], ['Томатная паста', '2 ст. л.'],
  ['Растительное масло', '2 ст. л.'], ['Соль и перец', 'по вкусу'],
]

const repo = 'https://github.com/NiksonSwan/cookbook_EM_11'
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n))
const Scene = lazy(() => import('./Scene.jsx'))

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return reduced
}

export default function App() {
  const journey = useRef(null)
  const [progress, setProgress] = useState(0)
  const [sceneReady, setSceneReady] = useState(false)
  const reducedMotion = useReducedMotion()
  const active = clamp(Math.floor(progress + 0.16), 0, steps.length - 1)

  useEffect(() => {
    let frame = 0
    const update = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        if (!journey.current) return
        const rect = journey.current.getBoundingClientRect()
        const position = (window.innerHeight * 0.60 - rect.top) / window.innerHeight
        setProgress(clamp(position, 0, steps.length - 0.01))
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const element = journey.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSceneReady(true)
        observer.disconnect()
      }
    }, { rootMargin: '600px 0px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const goTo = (index) => document.getElementById(`step-${index}`)?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' })

  return (
    <div className="app-shell">
      <div className="grain" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Наверх, кулинарная книга">
          <span className="brand-symbol" aria-hidden="true">✳</span>
          <span>КУЛИНАРНАЯ<br /><strong>КНИГА</strong></span>
        </a>
        <nav className="topnav" aria-label="Основная навигация">
          <a href="#process">Процесс</a>
          <a href="#recipe">Ингредиенты</a>
          <a href="#more">Другие блюда</a>
        </nav>
        <a className="topbar-link" href={repo} target="_blank" rel="noreferrer">Репозиторий <span aria-hidden="true">↗</span></a>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> КОМАНДНАЯ КНИГА РЕЦЕПТОВ <span className="eyebrow-dot">●</span> ГЛАВА 01</div>
            <h1 id="hero-title">Борщ.<br /><em>История в</em><br />одной кастрюле.</h1>
            <p>Шесть простых шагов — от прозрачного бульона до насыщенного рубинового цвета. Листай вниз, и ингредиенты сами найдут дорогу в кастрюлю.</p>
            <a className="primary-button" href="#process">Начать готовить <span aria-hidden="true">↓</span></a>
            <div className="hero-facts"><span>90 МИНУТ</span><span>4 ПОРЦИИ</span><span>ПОШАГОВО</span></div>
          </div>
          <div className="hero-visual">
            <img src={borschPhoto} alt="Тарелка борща со сметаной и зеленью" fetchPriority="high" />
            <span className="hero-vertical">ДОМАШНИЙ РЕЦЕПТ · ЧАСТЬ КНИГИ</span>
            <div className="hero-seal"><span>01</span><small>ИЗ КНИГИ<br />РЕЦЕПТОВ</small></div>
          </div>
          <span className="hero-scroll">ПРОКРУТИ ВНИЗ <span aria-hidden="true">↘</span></span>
        </section>

        <div className="section-intro" id="process">
          <span className="section-kicker">ПОШАГОВОЕ ПРИГОТОВЛЕНИЕ</span>
          <h2>Вся магия — <em>в порядке.</em></h2>
          <p>Каждый следующий шаг открывается при прокрутке. Анимация показывает порядок ингредиентов; точное время и действия указаны в тексте.</p>
        </div>

        <section className="journey" ref={journey} aria-label="Шесть шагов приготовления борща">
          <div className="journey-scene" aria-hidden="true">
            <Suspense fallback={<div className="scene-loading"><img src={borschPhoto} alt="" /><span>Готовим сцену…</span></div>}>
              {sceneReady ? <Scene progress={progress} reducedMotion={reducedMotion} /> : <div className="scene-loading"><img src={borschPhoto} alt="" /><span>Готовим сцену…</span></div>}
            </Suspense>
            <div className="scene-caption"><span className="live-dot" /> В КАСТРЮЛЕ СЕЙЧАС <strong>{steps[active].ingredient}</strong></div>
            <span className="scene-coordinate">БОРЩ · 3D / 01—06</span>
          </div>
          <div className="journey-steps">
            {steps.map((step, index) => (
              <article id={`step-${index}`} className="step" key={step.title}>
                <div className={`step-card ${active === index ? 'step-card-active' : ''}`}>
                  <div className="step-card-top"><span>ЭТАП {String(index + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}</span><span className="step-time">{step.time}</span></div>
                  <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{step.title}</h3>
                  <div className="step-rule" />
                  <p>{step.text}</p>
                  <div className="ingredient-tag"><span>В КАСТРЮЛЮ</span> {step.ingredient}</div>
                </div>
              </article>
            ))}
          </div>
          <div className="step-index" aria-label="Перейти к шагу">
            {steps.map((step, index) => (
              <button key={step.title} type="button" aria-label={`Шаг ${index + 1}: ${step.title}`} aria-current={active === index ? 'step' : undefined} className={active === index ? 'is-active' : ''} onClick={() => goTo(index)} />
            ))}
          </div>
          <div className="journey-progress" style={{ transform: `scaleY(${clamp((progress + 0.5) / steps.length, 0.04, 1)})` }} aria-hidden="true" />
        </section>

        <section className="recipe-section" id="recipe">
          <div className="recipe-heading"><span className="section-kicker">ПОСЛЕ ПРОКРУТКИ — К ПЛИТЕ</span><h2>Теперь <em>по-настоящему.</em></h2><p>Собери продукты до начала приготовления. Чеклист можно отметить прямо здесь — отметки сохранятся до обновления страницы.</p></div>
          <div className="recipe-layout">
            <div className="ingredients-panel">
              <div className="ingredients-panel-head"><h3>Ингредиенты</h3><span>НА 4 ПОРЦИИ</span></div>
              <ul className="shopping-list">{shopping.map(([name, amount]) => <li key={name}><label><input type="checkbox" /><span className="check-box" aria-hidden="true" /><span className="shopping-name">{name}</span><strong>{amount}</strong></label></li>)}</ul>
            </div>
            <div className="recipe-note"><span className="note-symbol">✳</span><span className="section-kicker">СОВЕТ АВТОРА</span><blockquote>Борщу нужно немного тишины: дай ему настояться под крышкой и подавай со сметаной и зеленью.</blockquote><a href={`${repo}/blob/main/recipes/borsch.md`} target="_blank" rel="noreferrer">Открыть рецепт в книге ↗</a></div>
          </div>
        </section>

        <section className="more-section" id="more">
          <div className="more-copy"><span className="section-kicker">ЕЩЁ ИЗ КУЛИНАРНОЙ КНИГИ</span><h2>На десерт —<br /><em>сырники.</em></h2><p>Пока борщ настаивается, открой второй рецепт: хрустящая корочка, мягкая середина и всего 25 минут.</p><a className="text-link" href={`${repo}/blob/main/recipes/syrniki.md`} target="_blank" rel="noreferrer">Рецепт сырников <span aria-hidden="true">↗</span></a></div>
          <img src={syrnikiPhoto} alt="Золотистые сырники со сметаной и ягодами" loading="lazy" />
        </section>
      </main>
      <footer><span>КУЛИНАРНАЯ КНИГА · ЭМ-11</span><span>ИЛЛЮСТРАЦИИ БЛЮД СОЗДАНЫ ДЛЯ ПРОЕКТА</span><a href="#top">Наверх ↑</a></footer>
    </div>
  )
}
