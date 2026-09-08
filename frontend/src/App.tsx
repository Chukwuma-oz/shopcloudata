import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number; name: string; category: string; price: number;
  rating: number; emoji: string; description: string; stock: number;
};
type CartItem = Product & { quantity: number };

const API_URL = import.meta.env.VITE_API_URL || "";
const money = (n:number) => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(n);

export default function App() {
  const [products,setProducts]=useState<Product[]>([]);
  const [cart,setCart]=useState<CartItem[]>(()=>JSON.parse(localStorage.getItem("shopcloud-cart")||"[]"));
  const [search,setSearch]=useState("");
  const [category,setCategory]=useState("All");
  const [notice,setNotice]=useState("");
  const [checkout,setCheckout]=useState(false);

  const categories=useMemo(()=>["All",...Array.from(new Set(products.map(p=>p.category)))],[products]);
  const visible=products.filter(p=>(category==="All"||p.category===category)&&`${p.name} ${p.description}`.toLowerCase().includes(search.toLowerCase()));
  const total=cart.reduce((s,i)=>s+i.price*i.quantity,0);
  const count=cart.reduce((s,i)=>s+i.quantity,0);

  useEffect(()=>localStorage.setItem("shopcloud-cart",JSON.stringify(cart)),[cart]);
  useEffect(()=>{fetch(`${API_URL}/api/products`).then(r=>r.json()).then(setProducts).catch(()=>setNotice("Backend connection failed."));},[]);

  function add(p:Product){
    setCart(c=>{const x=c.find(i=>i.id===p.id);return x?c.map(i=>i.id===p.id?{...i,quantity:i.quantity+1}:i):[...c,{...p,quantity:1}];});
    setNotice(`${p.name} added to cart.`);
  }
  function qty(id:number,d:number){setCart(c=>c.map(i=>i.id===id?{...i,quantity:i.quantity+d}:i).filter(i=>i.quantity>0));}

  async function order(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault(); const f=new FormData(e.currentTarget);
    try{
      const r=await fetch(`${API_URL}/api/orders`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        customer:{name:f.get("name"),email:f.get("email"),address:f.get("address")},items:cart,total
      })});
      const data=await r.json(); if(!r.ok) throw new Error(data.message);
      setCart([]);setCheckout(false);setNotice(`Order #${data.order.id} received successfully.`);
    }catch(err){setNotice(err instanceof Error?err.message:"Order failed.");}
  }

  return <div className="app">
    <header><div className="bar"><div className="brand"><b>S</b><span><strong>ShopCloud</strong><small>AWS e-commerce project</small></span></div><button className="cart" onClick={()=>setCheckout(true)}>🛒 Cart <i>{count}</i></button></div></header>
    <main>
      <section className="hero"><div><label>FULL-STACK AWS PROJECT</label><h1>Everything you need.<br/>One simple store.</h1><p>React, TypeScript, Node.js, MySQL, Redis and AWS-ready infrastructure.</p><a href="#products">Shop products ↓</a></div><div className="cloud">☁️<strong>Cloud ready</strong><small>Multi-AZ architecture</small></div></section>
      {notice&&<div className="notice">{notice}<button onClick={()=>setNotice("")}>×</button></div>}
      <section className="tools" id="products"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..."/><div>{categories.map(c=><button className={category===c?"active":""} onClick={()=>setCategory(c)} key={c}>{c}</button>)}</div></section>
      <section className="grid">{visible.map(p=><article className="card" key={p.id}><div className="pic">{p.emoji}</div><div className="body"><label>{p.category}</label><h2>{p.name}</h2><p>{p.description}</p><span>★ {p.rating}</span><footer><strong>{money(p.price)}</strong><button onClick={()=>add(p)}>Add to cart</button></footer></div></article>)}</section>
    </main>
    <footer><b>ShopCloud</b><span>Built for AWS learning</span></footer>
    {checkout&&<div className="overlay" onClick={()=>setCheckout(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modaltop"><h2>Your cart</h2><button onClick={()=>setCheckout(false)}>×</button></div>
      {!cart.length?<p>Your cart is empty.</p>:<><div className="items">{cart.map(i=><div className="item" key={i.id}><span>{i.emoji}</span><div><b>{i.name}</b><small>{money(i.price)}</small></div><section><button onClick={()=>qty(i.id,-1)}>−</button>{i.quantity}<button onClick={()=>qty(i.id,1)}>+</button></section></div>)}</div><div className="total"><span>Total</span><b>{money(total)}</b></div>
      <form onSubmit={order}><h3>Checkout</h3><input name="name" required placeholder="Full name"/><input name="email" type="email" required placeholder="Email"/><textarea name="address" required placeholder="Delivery address"/><button className="place">Place order · {money(total)}</button></form></>}
    </div></div>}
  </div>
}
