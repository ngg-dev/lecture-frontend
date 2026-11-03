import React, {useState,useEffect,useRef} from 'react';
const money=n=>new Intl.NumberFormat('ru-RU').format(n)+' ₽';
function Tokens({text}){
  const pattern=/(\/\/[^\n]*|"[^"\n]*"|'[^'\n]*'|\b(?:const|let|function|return|import|from|if|else|new|false|true)\b|\b\d+\b|<\/?[A-Za-z][\w.-]*)/g;
  return text.split(pattern).map((part,i)=>{let cls='';if(part.startsWith('//'))cls='tok-comment';else if(/^['"]/.test(part))cls='tok-str';else if(/^\d/.test(part))cls='tok-num';else if(part.startsWith('<'))cls='tok-tag';else if(/^(const|let|function|return|import|from|if|else|new|false|true)$/.test(part))cls='tok-key';return <span key={i} className={cls}>{part}</span>});
}
function Code({text,file='App.jsx',kind,highlight=[],focusLine,focusKey}){
  const scroll=useRef(null);
  useEffect(()=>{
    if(!focusLine)return;
    const panel=scroll.current,line=panel.querySelector('[data-line="'+focusLine+'"]');
    if(line)panel.scrollTop+=line.getBoundingClientRect().top-panel.getBoundingClientRect().top-20;
  },[focusLine,focusKey]);
  return <div className="code-shell"><div className="code-head"><span>{file}</span><span className="code-kind">{kind||(file.endsWith('.jsx')?'JSX':'JavaScript')}</span></div><div ref={scroll} className="code-scroll" tabIndex={0} aria-label={'Код '+file}><pre><code>{text.split('\n').map((line,i)=><span className={'code-line '+(highlight.includes(i+1)?'selected':'')} data-line={i+1} key={i}><Tokens text={line||' '}/></span>)}</code></pre></div></div>;
}
function Demo({children,label='Попробуем',className=''}){return <section className={'demo '+className} aria-label={label}><div className="demo-label">{label}</div>{children}</section>}
function Button({children,primary=false,...props}){return <button className={primary?'primary':''} {...props}>{children}</button>}
function Reveal({label,children}){const [open,setOpen]=useState(false);const id=React.useId();return <div className="reveal"><button aria-expanded={open} aria-controls={id} onClick={()=>setOpen(!open)}>{label}<span aria-hidden="true"> {open?'−':'+'}</span></button><div id={id} className={'reveal-panel '+(open?'open':'')} inert={!open} aria-hidden={!open}><div className="reveal-inner"><div className="reveal-content">{children}</div></div></div></div>}
function Note({children,warn=false}){return <div className={'note '+(warn?'warn':'')}>{children}</div>}
function Inline({children}){return <code className="inline-code">{children}</code>}
function Tabs({options,value,onChange,label='Выбор варианта'}){return <div className="tabs" role="group" aria-label={label}>{options.map(([id,text])=><button key={id} aria-pressed={value===id} onClick={()=>onChange(id)}>{text}</button>)}</div>}
function Head({chapter,title,lead}){return <header className="slide-heading"><div className="section-tag">{chapter}</div><h1>{title}</h1>{lead&&<p className="lead">{lead}</p>}</header>}
function ProductCard(props){return <article className="product-preview"><div className="product-kicker">ТОВАР</div><h2>{props.name}</h2><p className="price">{props.price} ₽</p></article>}

export {money,Code,Demo,Button,Reveal,Note,Inline,Tabs,Head,ProductCard};
