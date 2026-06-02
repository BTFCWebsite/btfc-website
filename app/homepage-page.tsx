'use client'
export default function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html:`*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Montserrat',sans-serif;background:#F2F2F2;color:#2D2D2D}
::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#041B5F}::-webkit-scrollbar-thumb{background:#1149D8;border-radius:3px}
@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes fadein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
nav{position:fixed;top:0;left:0;right:0;z-index:200;background:#041B5F;border-bottom:3px solid #1149D8;padding:0 20px}
.nav-inner{max-width:1320px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:64px}
.nav-logo{display:flex;align-items:center;gap:10px;cursor:pointer;background:none;border:none}
.nav-logo img{width:42px;height:42px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 2px #041B5F}
.nav-logo-text{color:#fff;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:18px;letter-spacing:.06em;line-height:1;text-align:left}
.nav-logo-sub{color:rgba(255,255,255,.4);font-size:9px;letter-spacing:.15em;text-transform:uppercase}
.nav-links{display:flex;gap:0;align-items:center}
.nav-link{background:none;border:none;cursor:pointer;color:rgba(255,255,255,.65);font-family:'Montserrat',sans-serif;font-weight:700;font-size:11px;letter-spacing:.07em;text-transform:uppercase;padding:8px 11px;border-bottom:3px solid transparent;transition:all .15s}
.nav-link:hover,.nav-link.active{color:#fff;border-bottom-color:#1149D8}
.nav-btn{background:#1149D8;color:#fff;border:none;padding:10px 18px;border-radius:6px;font-family:'Montserrat',sans-serif;font-weight:800;font-size:11px;cursor:pointer;letter-spacing:.08em;text-transform:uppercase;transition:background .15s;margin-left:12px;white-space:nowrap}
.nav-btn:hover{background:#2563FF}
.ticker-wrap{position:fixed;bottom:0;left:0;right:0;z-index:200;background:#041B5F;border-top:2px solid #1149D8;padding:7px 0;overflow:hidden}
.ticker-inner{display:flex;gap:52px;white-space:nowrap;animation:ticker 30s linear infinite}
.ticker-item{font-family:'Montserrat',sans-serif;font-weight:600;font-size:10px;color:rgba(255,255,255,.38);letter-spacing:.06em;flex-shrink:0;text-transform:uppercase}
.ticker-item b{color:rgba(255,255,255,.7)}
.ticker-item i{color:#1149D8;margin:0 6px;font-style:normal}
.page{display:none;padding-top:64px;padding-bottom:48px;animation:fadein .3s ease}
.page.active{display:block}
.hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:100px 24px 100px;position:relative;overflow:hidden}
.hero-bg{position:absolute;inset:0;z-index:0}
.hero-bg img{width:100%;height:100%;object-fit:cover;object-position:center 55%;display:block;filter:contrast(1.05) saturate(1.05)}
.hero-bg-fade{position:absolute;bottom:0;left:0;right:0;height:18%;background:linear-gradient(0deg,rgba(4,27,95,.7) 0%,transparent 100%)}
.hero-content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center}
.hero-sponsor{background:rgba(17,73,216,.35);border:1px solid rgba(17,73,216,.6);border-radius:4px;padding:7px 22px;margin-bottom:36px;display:flex;align-items:center;gap:12px}
.hero-sponsor-label{font-weight:700;font-size:10px;color:rgba(255,255,255,.6);letter-spacing:.14em;text-transform:uppercase}
.hero-sponsor-logo{background:#fff;border-radius:4px;padding:3px 10px;display:flex;align-items:center}
.hero-sponsor-logo img{height:24px;object-fit:contain;display:block}
.hero-badge{width:120px;height:120px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 3px #041B5F,0 0 0 5px #1149D8;overflow:hidden;background:#fff}
.hero-badge img{width:100%;height:100%;object-fit:cover}
.hero-title{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:clamp(48px,10vw,110px);color:#fff;margin:18px 0 0;letter-spacing:.04em;line-height:.88;text-shadow:0 2px 20px rgba(4,27,95,.9),0 4px 40px rgba(4,27,95,.7)}
.hero-tagline{font-weight:600;font-size:12px;color:rgba(255,255,255,.7);letter-spacing:.22em;text-transform:uppercase;margin:14px 0 44px;text-shadow:0 1px 10px rgba(4,27,95,.9)}
.hero-btns{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;margin-bottom:56px}
.btn-primary{background:#1149D8;color:#fff;border:none;padding:16px 36px;border-radius:6px;font-family:'Montserrat',sans-serif;font-weight:800;font-size:12px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;box-shadow:0 8px 28px rgba(17,73,216,.45);transition:all .2s}
.btn-primary:hover{background:#2563FF}
.btn-outline{background:transparent;color:#fff;border:2px solid rgba(255,255,255,.28);padding:14px 36px;border-radius:6px;font-family:'Montserrat',sans-serif;font-weight:700;font-size:12px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:all .2s}
.btn-outline:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.55)}
.hero-cards{display:flex;gap:16px;flex-wrap:wrap;justify-content:center}
.hero-card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:16px 22px;text-align:left;min-width:230px}
.hero-card.result{border-left:4px solid #22C55E}
.hero-card.fixture{border-left:4px solid #1149D8;background:rgba(17,73,216,.2)}
.hero-card-label{font-weight:700;font-size:9px;color:rgba(255,255,255,.38);letter-spacing:.16em;text-transform:uppercase;margin-bottom:6px}
.hero-card-main{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:20px;color:#fff;letter-spacing:.04em;line-height:1.1}
.hero-card-sub{font-size:11px;color:rgba(255,255,255,.35);margin-top:5px}
.stats-strip{position:absolute;bottom:0;left:0;right:0;background:rgba(4,27,95,.96);border-top:3px solid #1149D8;display:flex;justify-content:center;flex-wrap:wrap}
.stat-item{padding:14px 36px;text-align:center;border-right:1px solid rgba(255,255,255,.07)}
.stat-item:last-child{border-right:none}
.stat-val{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:26px;color:#1149D8;letter-spacing:.04em}
.stat-label{font-weight:600;font-size:9px;color:rgba(255,255,255,.38);letter-spacing:.12em;text-transform:uppercase}
.section{padding:72px 24px}
.section-white{background:#fff}
.section-offwhite{background:#F2F2F2}
.section-navy{background:#041B5F;position:relative;overflow:hidden}
.section-inner{max-width:1100px;margin:0 auto}
.section-inner-sm{max-width:900px;margin:0 auto}
.section-head{text-align:center;margin-bottom:48px}
.section-head h2{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:clamp(30px,4.5vw,50px);color:#2D2D2D;margin:0 0 8px;letter-spacing:.04em;line-height:1}
.section-head.light h2{color:#fff}
.section-head p{font-size:14px;color:#6B7280}
.section-head.light p{color:rgba(255,255,255,.5)}
.section-bar{width:52px;height:4px;background:#1149D8;margin:12px auto 0;border-radius:2px}
.wedge{height:56px;position:relative;overflow:hidden;flex-shrink:0;margin-bottom:-1px}
.wedge-shape{position:absolute;bottom:0;left:0;right:0;height:56px}
.news-grid-top{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;margin-bottom:20px}
.news-grid-bottom{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}
.news-card{background:#fff;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;cursor:pointer;transition:all .2s;box-shadow:0 2px 8px rgba(0,0,0,.04)}
.news-card:hover{transform:translateY(-4px);box-shadow:0 12px 36px rgba(17,73,216,.13)}
.news-card-img{height:160px;display:flex;align-items:center;justify-content:center;font-size:64px;position:relative;overflow:hidden}
.news-card-img.small{height:100px;font-size:40px}
.news-card-body{padding:20px}
.news-card-body.small{padding:16px}
.news-meta{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.news-date{font-size:11px;color:#9CA3AF}
.news-title{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:20px;color:#2D2D2D;margin:0 0 8px;letter-spacing:.03em;line-height:1.15}
.news-title.small{font-size:17px}
.news-excerpt{font-size:13px;color:#6B7280;margin:0 0 16px;line-height:1.55}
.news-more{font-weight:700;font-size:11px;color:#1149D8;letter-spacing:.08em;text-transform:uppercase}
.pill{display:inline-block;padding:3px 10px;border-radius:4px;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#fff}
.fixture-filters{display:flex;gap:8px;justify-content:center;margin-bottom:32px}
.filter-btn{padding:9px 26px;border-radius:6px;border:2px solid #D1D5DB;background:#fff;color:#6B7280;font-family:'Montserrat',sans-serif;font-weight:700;font-size:11px;cursor:pointer;letter-spacing:.08em;text-transform:uppercase;transition:all .15s}
.filter-btn.active{background:#1149D8;border-color:#1149D8;color:#fff}
.fixture-list{display:flex;flex-direction:column;gap:3px}
.fixture-row{background:#fff;border:1px solid #E5E7EB;border-radius:8px;padding:14px 20px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;transition:box-shadow .15s;border-left:4px solid #E5E7EB}
.fixture-row.win{border-left-color:#22C55E}
.fixture-row.loss{border-left-color:#EF4444}
.fixture-row.draw{border-left-color:#F59E0B}
.fixture-row.upcoming{border-left-color:#1149D8}
.fixture-row:hover{box-shadow:0 4px 16px rgba(0,0,0,.08)}
.fixture-date{width:80px;flex-shrink:0}
.fixture-date-main{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:13px;color:#2D2D2D;letter-spacing:.02em}
.fixture-date-sub{font-size:11px;color:#9CA3AF}
.fixture-teams{flex:1;display:flex;align-items:center;gap:10px;min-width:200px}
.fixture-team{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:17px;letter-spacing:.03em}
.fixture-team.btfc{color:#041B5F;font-size:19px;display:flex;align-items:center;gap:7px}
.fixture-team.btfc img{width:22px;height:22px;border-radius:50%;background:#fff;border:1px solid #D1D5DB;flex-shrink:0}
.fixture-team.opp{color:#6B7280;font-size:15px;display:flex;align-items:center;gap:6px}
.fixture-team.opp img{width:22px;height:22px;border-radius:50%;background:#F3F4F6;border:1px solid #E5E7EB;flex-shrink:0}
.fixture-score{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:22px;min-width:52px;text-align:center;color:#2D2D2D;background:#F9FAFB;border-radius:6px;padding:3px 8px}
.fixture-score.win{color:#22C55E}
.fixture-score.draw{color:#F59E0B}
.fixture-score.loss{color:#EF4444}
.fixture-vs{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:13px;color:#9CA3AF;min-width:52px;text-align:center;letter-spacing:.06em}
.fixture-venue{font-size:11px;color:#9CA3AF;white-space:nowrap}
.table-wrap{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;overflow:hidden}
.table-header{display:grid;grid-template-columns:40px 1fr 40px 40px 40px 40px 56px 52px;background:#1149D8;padding:10px 16px;gap:4px}
.table-header span{font-weight:700;font-size:10px;color:#fff;letter-spacing:.1em;text-transform:uppercase;text-align:center}
.table-header span:nth-child(2){text-align:left}
.table-row{display:grid;grid-template-columns:40px 1fr 40px 40px 40px 40px 56px 52px;padding:12px 16px;gap:4px;border-bottom:1px solid rgba(255,255,255,.05)}
.table-row.btfc{background:rgba(17,73,216,.28);border-left:3px solid #1149D8}
.table-pos{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:16px;color:rgba(255,255,255,.45);text-align:center}
.table-pos.btfc{color:#1149D8}
.table-club{font-size:13px;color:#fff;display:flex;align-items:center;gap:6px}
.table-club.btfc{font-weight:700}
.table-club img{width:20px;height:20px;border-radius:50%;background:#fff}
.table-stat{font-size:13px;color:rgba(255,255,255,.65);text-align:center}
.table-pts{font-size:13px;color:#2563FF;font-weight:700;text-align:center}
.pos-filters{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:36px}
.pos-btn{padding:7px 16px;border-radius:99px;border:2px solid #D1D5DB;background:#fff;color:#6B7280;font-family:'Montserrat',sans-serif;font-weight:700;font-size:11px;cursor:pointer;letter-spacing:.08em;transition:all .15s}
.pos-btn.active{background:#1149D8;border-color:#1149D8;color:#fff}
.squad-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:14px}
.player-card{background:#fff;border:2px solid #E5E7EB;border-radius:8px;overflow:hidden;cursor:pointer;transition:all .2s}
.player-card:hover{transform:translateY(-4px)}
.player-card.selected{background:#041B5F;border-color:#1149D8;box-shadow:0 8px 28px rgba(17,73,216,.22)}
.player-bar{height:6px}
.player-body{padding:18px 14px 16px;text-align:center}
.player-num{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:46px;line-height:1;margin-bottom:-4px;color:rgba(17,73,216,.1)}
.player-card.selected .player-num{color:rgba(255,255,255,.06)}
.player-name{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:16px;margin-top:8px;letter-spacing:.03em;line-height:1.1;color:#2D2D2D}
.player-card.selected .player-name{color:#fff}
.player-age{font-size:11px;color:#9CA3AF;margin-top:3px}
.player-card.selected .player-age{color:rgba(255,255,255,.4)}
.player-stats{margin-top:14px;display:flex;justify-content:space-around;border-top:1px solid rgba(255,255,255,.1);padding-top:12px}
.pstat-val{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:26px}
.pstat-label{font-size:9px;letter-spacing:.1em;color:rgba(255,255,255,.4)}
.ground-section{background:#041B5F}
.ground-img-wrap{position:relative;height:clamp(320px,50vw,560px);overflow:hidden}
.ground-img-wrap img{width:100%;height:100%;object-fit:cover;object-position:center 55%;display:block;filter:contrast(1.05) saturate(1.05)}
.ground-fade{position:absolute;bottom:0;left:0;right:0;height:50%;background:linear-gradient(0deg,rgba(4,27,95,.92) 0%,transparent 100%)}
.ground-overlay{position:absolute;bottom:0;left:0;right:0;padding:28px 40px 32px}
.ground-inner{max-width:1200px;margin:0 auto;display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:16px}
.ground-label{font-weight:700;font-size:10px;color:rgba(255,255,255,.5);letter-spacing:.2em;text-transform:uppercase;margin-bottom:6px}
.ground-name{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:clamp(26px,4vw,48px);color:#fff;margin:0;letter-spacing:.04em;line-height:1}
.ground-sub{font-size:13px;color:rgba(255,255,255,.6);margin:6px 0 0}
.ground-strip{background:#1149D8;display:flex;flex-wrap:wrap;justify-content:center}
.ground-stat{padding:14px 32px;text-align:center;flex:1 1 140px;border-right:1px solid rgba(255,255,255,.18)}
.ground-stat:last-child{border-right:none}
.ground-stat-val{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:18px;color:#fff;line-height:1}
.ground-stat-label{font-weight:600;font-size:9px;color:rgba(255,255,255,.6);letter-spacing:.14em;text-transform:uppercase;margin-top:3px}
.sponsor-grid{display:flex;gap:18px;flex-wrap:wrap;justify-content:center;margin-bottom:48px}
.sponsor-card{background:#fff;border:2px solid #E5E7EB;border-radius:8px;padding:26px 20px;text-align:center;cursor:pointer;transition:all .22s;position:relative;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.04)}
.sponsor-card:hover{transform:translateY(-5px);box-shadow:0 10px 36px rgba(17,73,216,.11)}
.scard-bar{height:3px;position:absolute;top:0;left:0;right:0}
.scard-logo{margin-bottom:10px;display:flex;align-items:center;justify-content:center}
.scard-name{font-family:'Barlow Condensed',sans-serif;color:#2D2D2D;margin:0 0 3px;letter-spacing:.04em}
.scard-desc{font-weight:700;font-size:9px;letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px}
.scard-since{font-size:11px;color:#9CA3AF;margin-bottom:6px}
.scard-impr{border-radius:5px;padding:7px 10px;margin-bottom:10px}
.scard-impr-val{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:20px}
.scard-impr-label{font-size:9px;color:#9CA3AF;letter-spacing:.1em;text-transform:uppercase}
.scard-btn{width:100%;padding:7px;background:transparent;border-radius:4px;font-family:'Montserrat',sans-serif;font-weight:700;font-size:9px;cursor:pointer;letter-spacing:.1em;text-transform:uppercase}
.tier-div{display:flex;align-items:center;gap:14px;margin-bottom:20px}
.tier-line{height:2px;flex:1}
.tier-badge{border-radius:4px;padding:5px 18px}
.sponsor-cta{background:#041B5F;border-radius:8px;padding:52px 40px;text-align:center;position:relative;overflow:hidden;margin-top:16px}
.sponsor-cta h3{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:clamp(26px,4vw,40px);color:#fff;margin:16px 0 12px;letter-spacing:.04em}
.sponsor-cta p{font-size:14px;color:rgba(255,255,255,.55);margin-bottom:28px;max-width:460px;margin-left:auto;margin-right:auto}
.ticket-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:20px;margin-bottom:48px}
.ticket-card{background:#fff;border:2px solid #E5E7EB;border-radius:8px;padding:28px 22px;cursor:pointer;transition:all .22s;position:relative;overflow:hidden}
.ticket-card:hover{transform:translateY(-4px);border-color:#1149D8}
.ticket-card.selected{transform:translateY(-6px);border-color:#1149D8;background:#041B5F;box-shadow:0 12px 40px rgba(17,73,216,.22)}
.tcard-bar{height:4px;background:#1149D8;border-radius:2px;margin-bottom:20px}
.tcard-label{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:20px;color:#2D2D2D;letter-spacing:.03em;white-space:nowrap}
.ticket-card.selected .tcard-label{color:#fff}
.tcard-price{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:42px;color:#1149D8;letter-spacing:.04em;line-height:1}
.ticket-card.selected .tcard-price{color:#2563FF}
.tcard-desc{font-size:12px;color:#6B7280;margin-bottom:16px;line-height:1.5}
.ticket-card.selected .tcard-desc{color:rgba(255,255,255,.55)}
.tcard-perks{list-style:none;margin-bottom:20px}
.tcard-perk{font-size:11px;color:#374151;display:flex;align-items:center;gap:6px;margin-bottom:5px}
.ticket-card.selected .tcard-perk{color:rgba(255,255,255,.7)}
.tcard-check{color:#1149D8;font-weight:700}
.ticket-card.selected .tcard-check{color:#2563FF}
.tcard-btn{width:100%;padding:11px;background:transparent;color:#1149D8;border:2px solid #1149D8;border-radius:6px;font-family:'Montserrat',sans-serif;font-weight:700;font-size:11px;cursor:pointer;letter-spacing:.08em;text-transform:uppercase;transition:all .15s}
.ticket-card.selected .tcard-btn{background:#1149D8;color:#fff}
.checkout-box{background:#fff;border:2px solid #1149D8;border-radius:8px;padding:36px 32px;max-width:580px;margin:0 auto;box-shadow:0 8px 32px rgba(17,73,216,.12)}
.form-label{display:block;font-weight:700;font-size:10px;color:#6B7280;letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px}
.form-input{width:100%;background:#F2F2F2;border:1px solid #E5E7EB;border-radius:6px;padding:11px 14px;font-family:'Montserrat',sans-serif;font-size:13px;color:#2D2D2D;outline:none;margin-bottom:16px;box-sizing:border-box}
.form-input:focus{border-color:#1149D8}
.contact-input{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:11px 14px;color:#fff;font-family:'Montserrat',sans-serif;font-size:13px;outline:none;box-sizing:border-box;margin-bottom:16px}
.contact-input:focus{border-color:#1149D8}
select.contact-input{background:#0B1E56}
.info-card{background:#fff;border:1px solid #E5E7EB;border-radius:8px;padding:22px 20px;box-shadow:0 2px 6px rgba(0,0,0,.04)}
.info-card-icon{font-size:30px;margin-bottom:10px}
.info-card-title{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:20px;color:#2D2D2D;letter-spacing:.03em;margin-bottom:8px}
.info-card-body{font-size:13px;color:#6B7280;line-height:1.6}
.ticket-promo{background:#041B5F;border-radius:8px;padding:44px 40px;display:flex;gap:28px;align-items:center;flex-wrap:wrap;position:relative;overflow:hidden}
.tpromo-info{flex:1}
.tpromo-prices{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
.tprice-mini{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:6px;padding:12px 18px;text-align:center;min-width:90px}
.tprice-mini-label{font-weight:600;font-size:10px;color:rgba(255,255,255,.5);letter-spacing:.1em;text-transform:uppercase}
.tprice-mini-val{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:26px;color:#fff}
footer{background:#020B30;border-top:3px solid #1149D8;padding:52px 24px 24px}
.footer-grid{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:44px;margin-bottom:44px}
.footer-label{font-weight:700;font-size:10px;color:rgba(255,255,255,.28);letter-spacing:.14em;text-transform:uppercase;margin-bottom:14px}
.footer-link{font-size:12px;color:rgba(255,255,255,.45);margin-bottom:9px;cursor:pointer;transition:color .15s;display:block;background:none;border:none;text-align:left;font-family:'Montserrat',sans-serif}
.footer-link:hover{color:#1149D8}
.footer-contact{font-size:12px;color:rgba(255,255,255,.4);margin-bottom:10px;line-height:1.5}
.footer-bottom{border-top:1px solid rgba(255,255,255,.05);padding-top:18px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;max-width:1280px;margin:0 auto}
.footer-copy{font-size:11px;color:rgba(255,255,255,.18)}
.social-icons{display:flex;gap:9px}
.social-icon{width:34px;height:34px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:6px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;font-weight:700;font-size:13px;color:rgba(255,255,255,.5);transition:all .15s}
.social-icon:hover{background:#1149D8;color:#fff}
@media(max-width:768px){
  .nav-links{display:none}
  .hero-title{font-size:clamp(42px,12vw,80px)}
  .ground-overlay{padding:16px 20px 20px}
  .ticket-promo{flex-direction:column}
}`}} />
      <div dangerouslySetInnerHTML={{__html:`<nav id="navbar">
  <div class="nav-inner">
    <button class="nav-logo" onclick="showPage('home')">
      <img src="/crest.png" alt="BTFC">
      <div>
        <div class="nav-logo-text">BRIMSCOMBE &amp; THRUPP FC</div>
        <div class="nav-logo-sub">Official Website</div>
      </div>
    </button>
    <div class="nav-links">
      <button class="nav-link active" onclick="showPage('home')">Home</button>
      <button class="nav-link" onclick="showPage('news')">News</button>
      <button class="nav-link" onclick="showPage('teams')">Teams</button>
      <button class="nav-link" onclick="showPage('fixtures')">Matches</button>
      <button class="nav-link" onclick="showPage('tickets')">Tickets</button>
      <button class="nav-link" onclick="showPage('matchday')">Matchday</button>
      <button class="nav-link" onclick="showPage('sponsors')">Sponsors</button>
      <button class="nav-link" onclick="showPage('club')">Club</button>
      <button class="nav-link" onclick="showPage('shop')">Shop</button>
      <button class="nav-link" onclick="showPage('contact')">Contact</button>
      <button class="nav-btn" onclick="showPage('tickets')">&#127915; Buy Tickets</button>
    </div>
  </div>
</nav>

<div class="ticker-wrap">
  <div class="ticker-inner">
    <span class="ticker-item"><b>Jessons Real Estate</b><i>&middot;</i>Official Ground Sponsor &mdash; The Jessons Meadow</span>
    <span class="ticker-item"><b>GEL Engineering</b><i>&middot;</i>First Team Sponsor</span>
    <span class="ticker-item"><b>Reserves Sponsor TBC</b><i>&middot;</i>Reserves Sponsor</span>
    <span class="ticker-item"><b>U17s Sponsor TBC</b><i>&middot;</i>Under 17s Sponsor</span>
    <span class="ticker-item"><b>Your Business Here</b><i>&middot;</i>Gold Partner &mdash; enquire now</span>
    <span class="ticker-item"><b>Your Business Here</b><i>&middot;</i>Club Partner &mdash; enquire now</span>
    <span class="ticker-item"><b>Jessons Real Estate</b><i>&middot;</i>Official Ground Sponsor &mdash; The Jessons Meadow</span>
    <span class="ticker-item"><b>GEL Engineering</b><i>&middot;</i>First Team Sponsor</span>
    <span class="ticker-item"><b>Reserves Sponsor TBC</b><i>&middot;</i>Reserves Sponsor</span>
    <span class="ticker-item"><b>U17s Sponsor TBC</b><i>&middot;</i>Under 17s Sponsor</span>
    <span class="ticker-item"><b>Your Business Here</b><i>&middot;</i>Gold Partner &mdash; enquire now</span>
    <span class="ticker-item"><b>Your Business Here</b><i>&middot;</i>Club Partner &mdash; enquire now</span>
  </div>
</div>

<!-- HOME -->
<div id="page-home" class="page active">
  <section class="hero">
    <div class="hero-bg">
      <img src="/Ground_Pic.jpeg" alt="The Jessons Meadow">
      <div class="hero-bg-fade"></div>
    </div>
    <div class="hero-content">
      <div class="hero-sponsor">
        <span class="hero-sponsor-label">First Team Sponsor</span>
        <div class="hero-sponsor-logo"><img src="/gel-logo.png" alt="GEL Engineering"></div>
      </div>
      <div class="hero-badge"><img src="/crest.png" alt="BTFC Crest"></div>
      <h1 class="hero-title">BRIMSCOMBE<br>&amp; THRUPP FC</h1>
      <p class="hero-tagline">Est. 1886 &middot; The Lilywhites</p>
      <div class="hero-btns">
        <button class="btn-primary" onclick="showPage('tickets')">&#127915; Season Tickets</button>
        <button class="btn-outline" onclick="showPage('fixtures')">View Fixtures</button>
      </div>
      <div class="hero-cards">
        <div class="hero-card result" style="border-left-color:#EF4444">
          <div class="hero-card-label">Latest Result</div>
          <div class="hero-card-main">BTFC <span style="color:#EF4444">1-2</span> FC Stratford</div>
          <div class="hero-card-sub">Sat 18 Apr 2026 &middot; Hellenic Div One</div>
        </div>
        <div class="hero-card fixture">
          <div class="hero-card-label">Next Fixture</div>
          <div class="hero-card-main">BTFC vs Oakfield United</div>
          <div class="hero-card-sub">Sat 7 Jun &middot; 15:00 &middot; The Meadow</div>
        </div>
      </div>
    </div>
    <div class="stats-strip">
      <div class="stat-item"><div class="stat-val">7th</div><div class="stat-label">League Position</div></div>
      <div class="stat-item"><div class="stat-val">59</div><div class="stat-label">Goals Scored</div></div>
      <div class="stat-item"><div class="stat-val">44%</div><div class="stat-label">Win Rate</div></div>
      <div class="stat-item"><div class="stat-val">Hellenic</div><div class="stat-label">Division One</div></div>
    </div>
  </section>

  <!-- Jessons Ground Sponsor Strip -->
  <div style="background:#F2F2F2;border-bottom:1px solid #E5E7EB;padding:10px 24px">
    <div style="max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap">
      <span style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:13px;color:#6B7280;letter-spacing:.08em;text-transform:uppercase">Home of BTFC</span>
      <div style="width:1px;height:20px;background:#D1D5DB"></div>
      <span style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:15px;color:#041B5F;letter-spacing:.04em">THE JESSONS MEADOW</span>
      <div style="width:1px;height:20px;background:#D1D5DB"></div>
      <span style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:12px;color:#9CA3AF;letter-spacing:.06em;text-transform:uppercase">Ground Sponsor</span>
      <img src="/jessons-logo.png" alt="Jessons Real Estate" style="height:32px;object-fit:contain">
    </div>
  </div>

  <section class="section section-white">
    <div class="section-inner">
      <div class="section-head"><h2>Latest News</h2><p>The latest from Brimscombe &amp; Thrupp FC</p><div class="section-bar"></div></div>
      <div class="news-grid-top">
        <div class="news-card" onclick="showPage('news')"><div class="news-card-img" style="background:linear-gradient(135deg,#041B5F,#1149D8)">&#9917;</div><div class="news-card-body"><div class="news-meta"><span class="pill" style="background:#1149D8">Match Report</span><span class="news-date">24 May 2026</span></div><h3 class="news-title">Tyler Cross Hits 18 Goals for the Season</h3><p class="news-excerpt">A brace against Vale Athletic takes our top scorer to an incredible 18 league goals this season.</p><span class="news-more">Read More &rarr;</span></div></div>
        <div class="news-card" onclick="showPage('news')"><div class="news-card-img" style="background:linear-gradient(135deg,#041B5F,#3F4DA1)">&#127903;</div><div class="news-card-body"><div class="news-meta"><span class="pill" style="background:#92400E">Tickets</span><span class="news-date">21 May 2026</span></div><h3 class="news-title">2026/27 Season Tickets Now on Sale</h3><p class="news-excerpt">Season tickets for the 2026/27 campaign are now available. Early bird prices until July 1st.</p><span class="news-more">Read More &rarr;</span></div></div>
      </div>
      <div class="news-grid-bottom">
        <div class="news-card" onclick="showPage('news')"><div class="news-card-img small" style="background:linear-gradient(135deg,#041B5F,#1149D8)">&#129309;</div><div class="news-card-body small"><div class="news-meta"><span class="pill" style="background:#041B5F">Club News</span><span class="news-date">20 May</span></div><h4 class="news-title small">GEL Engineering Kit Sponsorship Renewed</h4><span class="news-more">Read More &rarr;</span></div></div>
        <div class="news-card" onclick="showPage('news')"><div class="news-card-img small" style="background:linear-gradient(135deg,#041B5F,#3F4DA1)">&#128197;</div><div class="news-card-body small"><div class="news-meta"><span class="pill" style="background:#2563FF">Announcement</span><span class="news-date">15 May</span></div><h4 class="news-title small">Pre-Season Training Dates Announced</h4><span class="news-more">Read More &rarr;</span></div></div>
        <div class="news-card" onclick="showPage('news')"><div class="news-card-img small" style="background:linear-gradient(135deg,#041B5F,#1149D8)">&#127942;</div><div class="news-card-body small"><div class="news-meta"><span class="pill" style="background:#166534">Youth</span><span class="news-date">10 May</span></div><h4 class="news-title small">U18s Win County Cup Final</h4><span class="news-more">Read More &rarr;</span></div></div>
      </div>
      <div style="text-align:center;margin-top:36px"><button class="btn-outline" style="color:#1149D8;border-color:#1149D8" onclick="showPage('news')">All News &rarr;</button></div>
    </div>
  </section>

  <div class="wedge" style="background:#F2F2F2"><div class="wedge-shape" style="background:#041B5F;clip-path:polygon(100% 0,100% 100%,0 100%)"></div></div>
  <section class="section section-offwhite">
    <div class="section-inner-sm">
      <div class="section-head"><h2>Fixtures &amp; Results</h2><p>Upcoming games and recent results</p><div class="section-bar"></div></div>
      <div class="fixture-list" id="home-fixtures"></div>
      <div style="text-align:center;margin-top:24px"><button class="btn-outline" style="color:#1149D8;border-color:#1149D8" onclick="showPage('fixtures')">All Fixtures &rarr;</button></div>
    </div>
  </section>

  <div class="wedge" style="background:#F2F2F2"><div class="wedge-shape" style="background:#041B5F;clip-path:polygon(0 100%,100% 0,100% 100%)"></div></div>
  <div class="ground-section">
    <div class="ground-img-wrap">
      <img src="/Ground_Pic.jpeg" alt="The Jessons Meadow">
      <div class="ground-fade"></div>
      <div class="ground-overlay">
        <div class="ground-inner">
          <div>
            <div class="ground-label">Our Home Ground</div>
            <h2 class="ground-name">The Jessons Meadow</h2>
            <p class="ground-sub">The Jessons Meadow, Brimscombe &middot; Est. 1886</p>
          </div>
          <div style="display:flex;gap:12px;flex-shrink:0">
            <button class="btn-primary" onclick="showPage('matchday')">Matchday Info</button>
            <button class="btn-outline" onclick="showPage('tickets')">Get Tickets</button>
          </div>
        </div>
      </div>
    </div>
    <div class="ground-strip">
      <div class="ground-stat"><div class="ground-stat-val">&#127967; The Jessons Meadow</div><div class="ground-stat-label">Sponsored by Jessons Real Estate</div></div>
      <div class="ground-stat"><div class="ground-stat-val">&#128205; Brimscombe, Stroud</div><div class="ground-stat-label">Gloucestershire</div></div>
      <div class="ground-stat"><div class="ground-stat-val">&#129681; 1,000</div><div class="ground-stat-label">Capacity</div></div>
      <div class="ground-stat"><div class="ground-stat-val">&#128197; Est. 1886</div><div class="ground-stat-label">Founded</div></div>
    </div>
  </div>

  <section class="section section-navy">
    <div class="section-inner-sm">
      <div class="section-head light"><h2>League Table</h2><p>Uhlsport Hellenic League Division One &mdash; Final Table 2025/26</p><div class="section-bar"></div></div>
      <div class="table-wrap">
        <div class="table-header"><span>#</span><span>Club</span><span>P</span><span>W</span><span>D</span><span>L</span><span>GD</span><span>Pts</span></div>
        <div id="league-table"></div>
      </div>
    </div>
  </section>

  <div class="wedge" style="background:#041B5F"><div class="wedge-shape" style="background:#F2F2F2;clip-path:polygon(0 0,100% 100%,0 100%)"></div></div>
  <section class="section section-offwhite">
    <div class="section-inner">
      <div class="ticket-promo">
        <div class="tpromo-info">
          <span class="pill" style="background:#1149D8">Now On Sale</span>
          <h3 style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:clamp(26px,3.5vw,42px);color:#fff;margin:12px 0 8px;letter-spacing:.04em">2026/27 Season Tickets</h3>
          <p style="font-size:13px;color:rgba(255,255,255,.55)">Adult Early Bird &pound;90 &middot; Concession Early Bird &pound;70 &middot; Payment via Zettle</p>
        </div>
        <div class="tpromo-prices">
          <div class="tprice-mini"><div class="tprice-mini-label">Adult Early Bird</div><div class="tprice-mini-val">&pound;90</div></div>
          <div class="tprice-mini"><div class="tprice-mini-label">Concession E/B</div><div class="tprice-mini-val">&pound;70</div></div>
          <button class="btn-primary" onclick="showPage('tickets')">&#127915; Buy Now</button>
        </div>
      </div>
    </div>
  </section>

  <div class="wedge" style="background:#F2F2F2"><div class="wedge-shape" style="background:#041B5F;clip-path:polygon(100% 0,100% 100%,0 100%)"></div></div>
  <section class="section section-navy">
    <div class="section-inner">
      <div class="section-head light"><h2>Club Sponsors</h2><p>Our valued club partners</p><div class="section-bar"></div></div>
      <div style="display:flex;gap:20px;flex-wrap:wrap;justify-content:center;margin-bottom:24px">
        <!-- Jessons - Ground Sponsor -->
        <div class="sponsor-card" style="width:220px" onclick="showPage('sponsors')">
          <div class="scard-bar" style="background:#D4AF37"></div>
          <div class="scard-logo" style="height:60px;display:flex;align-items:center;justify-content:center">
            <img src="/jessons-logo.png" alt="Jessons Real Estate" style="max-height:100%;max-width:180px;object-fit:contain">
          </div>
          <div class="scard-name" style="font-size:15px">Jessons Real Estate</div>
          <div class="scard-desc" style="color:#D4AF37">Ground Sponsor</div>
        </div>
        <!-- GEL Engineering - First Team Sponsor -->
        <div class="sponsor-card" style="width:200px" onclick="showPage('sponsors')">
          <div class="scard-bar" style="background:#CBD5E1"></div>
          <div class="scard-logo" style="height:55px;display:flex;align-items:center;justify-content:center">
            <img src="/gel-logo.png" alt="GEL Engineering" style="max-height:100%;max-width:160px;object-fit:contain">
          </div>
          <div class="scard-name" style="font-size:14px">GEL Engineering</div>
          <div class="scard-desc" style="color:#CBD5E1">First Team Sponsor</div>
        </div>
      </div
      <div style="text-align:center"><button class="btn-outline" onclick="showPage('sponsors')">All Sponsors &rarr;</button></div>
    </div>
  </section>

  </div>

<!-- NEWS -->
<div id="page-news" class="page">
  <section class="section section-white">
    <div class="section-inner">
      <div class="section-head"><h2>Club News</h2><p>All the latest from Brimscombe &amp; Thrupp FC</p><div class="section-bar"></div></div>
      <div class="news-grid-top">
        <div class="news-card"><div class="news-card-img" style="background:linear-gradient(135deg,#041B5F,#1149D8)">&#9917;</div><div class="news-card-body"><div class="news-meta"><span class="pill" style="background:#1149D8">Match Report</span><span class="news-date">24 May 2026</span></div><h3 class="news-title">Tyler Cross Hits 18 Goals for the Season</h3><p class="news-excerpt">A brace against Vale Athletic takes our top scorer to an incredible 18 league goals this season.</p><span class="news-more">Read More &rarr;</span></div></div>
        <div class="news-card"><div class="news-card-img" style="background:linear-gradient(135deg,#041B5F,#3F4DA1)">&#127903;</div><div class="news-card-body"><div class="news-meta"><span class="pill" style="background:#92400E">Tickets</span><span class="news-date">21 May 2026</span></div><h3 class="news-title">2026/27 Season Tickets Now on Sale</h3><p class="news-excerpt">Season tickets for the 2026/27 campaign are now available. Early bird prices until July 1st.</p><span class="news-more">Read More &rarr;</span></div></div>
      </div>
      <div class="news-grid-bottom" style="margin-top:20px">
        <div class="news-card"><div class="news-card-img small" style="background:linear-gradient(135deg,#041B5F,#1149D8)">&#129309;</div><div class="news-card-body small"><div class="news-meta"><span class="pill" style="background:#041B5F">Club News</span><span class="news-date">20 May</span></div><h4 class="news-title small">GEL Engineering Kit Sponsorship Renewed</h4><span class="news-more">Read More &rarr;</span></div></div>
        <div class="news-card"><div class="news-card-img small" style="background:linear-gradient(135deg,#041B5F,#3F4DA1)">&#128197;</div><div class="news-card-body small"><div class="news-meta"><span class="pill" style="background:#2563FF">Announcement</span><span class="news-date">15 May</span></div><h4 class="news-title small">Pre-Season Training Dates Announced</h4><span class="news-more">Read More &rarr;</span></div></div>
        <div class="news-card"><div class="news-card-img small" style="background:linear-gradient(135deg,#041B5F,#1149D8)">&#127942;</div><div class="news-card-body small"><div class="news-meta"><span class="pill" style="background:#166534">Youth</span><span class="news-date">10 May</span></div><h4 class="news-title small">U18s Win County Cup Final</h4><span class="news-more">Read More &rarr;</span></div></div>
        <div class="news-card"><div class="news-card-img small" style="background:linear-gradient(135deg,#041B5F,#3F4DA1)">&#127359;</div><div class="news-card-body small"><div class="news-meta"><span class="pill" style="background:#374151">Matchday</span><span class="news-date">8 May</span></div><h4 class="news-title small">Matchday Parking Changes for 2026/27</h4><span class="news-more">Read More &rarr;</span></div></div>
      </div>
    </div>
  </section>
</div>

<!-- TEAMS -->
<div id="page-teams" class="page">
  <section class="section section-offwhite">
    <div class="section-inner">
      <div class="section-head"><h2>Our Teams</h2><p>Brimscombe &amp; Thrupp FC — all squads</p><div class="section-bar"></div></div>

      <!-- Team selector tabs -->
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:48px">
        <button id="tab-first" onclick="showTeam('first',this)"
          style="background:#1149D8;color:#fff;border:2px solid #1149D8;padding:12px 28px;border-radius:6px;font-family:'Montserrat',sans-serif;font-weight:700;font-size:12px;cursor:pointer;letter-spacing:.07em;text-transform:uppercase;transition:all .15s">
          &#9917; First XI
        </button>
        <button id="tab-reserves" onclick="showTeam('reserves',this)"
          style="background:transparent;color:#1149D8;border:2px solid #1149D8;padding:12px 28px;border-radius:6px;font-family:'Montserrat',sans-serif;font-weight:700;font-size:12px;cursor:pointer;letter-spacing:.07em;text-transform:uppercase;transition:all .15s">
          &#9917; Reserves
        </button>
        <button id="tab-u17" onclick="showTeam('u17',this)"
          style="background:transparent;color:#1149D8;border:2px solid #1149D8;padding:12px 28px;border-radius:6px;font-family:'Montserrat',sans-serif;font-weight:700;font-size:12px;cursor:pointer;letter-spacing:.07em;text-transform:uppercase;transition:all .15s">
          &#9917; Under 17s
        </button>
      </div>

      <!-- ── FIRST XI ── -->
      <div id="team-first">
        <div style="background:#041B5F;border-radius:8px;padding:20px 28px;margin-bottom:36px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
          <img src="" id="first-logo" style="width:56px;height:56px;border-radius:50%;background:#fff;border:2px solid #fff" alt="BTFC">
          <div>
            <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:24px;color:#fff;letter-spacing:.04em">BTFC First XI</div>
            <div style="font-size:12px;color:rgba(255,255,255,.55)">Uhlsport Hellenic League Division One &mdash; Manager: Tim Bond</div>
          </div>
          <div style="margin-left:auto;display:flex;gap:12px;flex-wrap:wrap">
            <div style="background:rgba(255,255,255,.08);border-radius:6px;padding:10px 18px;text-align:center">
              <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:22px;color:#fff">7th</div>
              <div style="font-size:9px;color:rgba(255,255,255,.5);letter-spacing:.1em;text-transform:uppercase">Final Position</div>
            </div>
            <div style="background:rgba(255,255,255,.08);border-radius:6px;padding:10px 18px;text-align:center">
              <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:22px;color:#fff">51</div>
              <div style="font-size:9px;color:rgba(255,255,255,.5);letter-spacing:.1em;text-transform:uppercase">Points</div>
            </div>
            <div style="background:rgba(255,255,255,.08);border-radius:6px;padding:10px 18px;text-align:center">
              <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:22px;color:#1149D8">15W</div>
              <div style="font-size:9px;color:rgba(255,255,255,.5);letter-spacing:.1em;text-transform:uppercase">Wins</div>
            </div>
          </div>
        </div>
        <div class="pos-filters">
          <button class="pos-btn active" onclick="filterSquad('All',this)">All</button>
          <button class="pos-btn" onclick="filterSquad('GK',this)">GK</button>
          <button class="pos-btn" onclick="filterSquad('CB',this)">CB</button>
          <button class="pos-btn" onclick="filterSquad('LB',this)">LB</button>
          <button class="pos-btn" onclick="filterSquad('RB',this)">RB</button>
          <button class="pos-btn" onclick="filterSquad('CM',this)">CM</button>
          <button class="pos-btn" onclick="filterSquad('CAM',this)">CAM</button>
          <button class="pos-btn" onclick="filterSquad('MID',this)">MID</button>
          <button class="pos-btn" onclick="filterSquad('LW',this)">LW</button>
          <button class="pos-btn" onclick="filterSquad('RW',this)">RW</button>
          <button class="pos-btn" onclick="filterSquad('ST',this)">ST</button>
        </div>
        <div class="squad-grid" id="squad-grid"></div>


        <!-- 2025/26 Season Stats -->
        <div style="margin-top:48px">
          <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:28px;color:#2D2D2D;letter-spacing:.04em;margin-bottom:24px">2025/26 Season Stats</div>

          <!-- Stats cards -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px;margin-bottom:28px">
            <div style="background:#041B5F;border-radius:8px;padding:16px;text-align:center"><div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:40px;color:#fff;line-height:1">7th</div><div style="font-size:10px;color:rgba(255,255,255,.5);letter-spacing:.1em;text-transform:uppercase;margin-top:4px">Final Position</div></div>
            <div style="background:#041B5F;border-radius:8px;padding:16px;text-align:center"><div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:40px;color:#1149D8;line-height:1">51</div><div style="font-size:10px;color:rgba(255,255,255,.5);letter-spacing:.1em;text-transform:uppercase;margin-top:4px">Points</div></div>
            <div style="background:#041B5F;border-radius:8px;padding:16px;text-align:center"><div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:40px;color:#22C55E;line-height:1">15</div><div style="font-size:10px;color:rgba(255,255,255,.5);letter-spacing:.1em;text-transform:uppercase;margin-top:4px">Wins</div></div>
            <div style="background:#041B5F;border-radius:8px;padding:16px;text-align:center"><div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:40px;color:#F59E0B;line-height:1">6</div><div style="font-size:10px;color:rgba(255,255,255,.5);letter-spacing:.1em;text-transform:uppercase;margin-top:4px">Draws</div></div>
            <div style="background:#041B5F;border-radius:8px;padding:16px;text-align:center"><div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:40px;color:#EF4444;line-height:1">13</div><div style="font-size:10px;color:rgba(255,255,255,.5);letter-spacing:.1em;text-transform:uppercase;margin-top:4px">Losses</div></div>
            <div style="background:#041B5F;border-radius:8px;padding:16px;text-align:center"><div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:40px;color:#fff;line-height:1">+9</div><div style="font-size:10px;color:rgba(255,255,255,.5);letter-spacing:.1em;text-transform:uppercase;margin-top:4px">Goal Diff</div></div>
          </div>

          <!-- Form guide -->
          <div style="background:#fff;border:1px solid #E5E7EB;border-radius:8px;padding:20px 24px;margin-bottom:20px">
            <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:18px;color:#2D2D2D;letter-spacing:.04em;margin-bottom:14px">Last 8 Results</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
              <div style="width:38px;height:38px;border-radius:6px;background:#EF4444;display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:17px;color:#fff;cursor:default" title="L 1-2 vs FC Stratford (H)">L</div>
              <div style="width:38px;height:38px;border-radius:6px;background:#22C55E;display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:17px;color:#fff;cursor:default" title="W 2-0 vs Thame Utd Res (A)">W</div>
              <div style="width:38px;height:38px;border-radius:6px;background:#F59E0B;display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:17px;color:#fff;cursor:default" title="D 1-1 vs Ludlow Town (A)">D</div>
              <div style="width:38px;height:38px;border-radius:6px;background:#EF4444;display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:17px;color:#fff;cursor:default" title="L 0-3 vs Malmesbury Victoria (A)">L</div>
              <div style="width:38px;height:38px;border-radius:6px;background:#22C55E;display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:17px;color:#fff;cursor:default" title="W 5-1 vs Wellington (H)">W</div>
              <div style="width:38px;height:38px;border-radius:6px;background:#22C55E;display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:17px;color:#fff;cursor:default" title="W 3-0 vs Redditch Borough (A)">W</div>
              <div style="width:38px;height:38px;border-radius:6px;background:#22C55E;display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:17px;color:#fff;cursor:default" title="W 4-0 vs Clanfield 85 (A)">W</div>
              <div style="width:38px;height:38px;border-radius:6px;background:#22C55E;display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:17px;color:#fff;cursor:default" title="W 4-1 vs Woodford United (H)">W</div>
              <span style="margin-left:6px;font-size:11px;color:#9CA3AF">&#8592; Most recent</span>
            </div>
            <div style="margin-top:10px;display:flex;gap:14px">
              <span style="display:flex;align-items:center;gap:5px;font-size:11px;color:#6B7280"><span style="width:12px;height:12px;border-radius:3px;background:#22C55E;display:inline-block"></span>Win</span>
              <span style="display:flex;align-items:center;gap:5px;font-size:11px;color:#6B7280"><span style="width:12px;height:12px;border-radius:3px;background:#F59E0B;display:inline-block"></span>Draw</span>
              <span style="display:flex;align-items:center;gap:5px;font-size:11px;color:#6B7280"><span style="width:12px;height:12px;border-radius:3px;background:#EF4444;display:inline-block"></span>Loss</span>
            </div>
          </div>

          <!-- League position snapshot -->
          <div style="background:#fff;border:1px solid #E5E7EB;border-radius:8px;padding:20px 24px;margin-bottom:20px">
            <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:18px;color:#2D2D2D;letter-spacing:.04em;margin-bottom:14px">Final League Position</div>
            <div style="display:flex;flex-direction:column;gap:4px">
              <div style="display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:6px;background:#F9FAFB">
                <span style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:14px;color:#9CA3AF;min-width:20px">1</span>
                <span style="font-size:12px;color:#6B7280;flex:1">FC Stratford</span>
                <span style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:14px;color:#2D2D2D">81 pts</span>
              </div>
              <div style="display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:6px;background:#F9FAFB">
                <span style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:14px;color:#9CA3AF;min-width:20px">2</span>
                <span style="font-size:12px;color:#6B7280;flex:1">Wantage Town</span>
                <span style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:14px;color:#2D2D2D">72 pts</span>
              </div>
              <div style="padding:4px 10px;text-align:center;font-size:18px;color:#D1D5DB;letter-spacing:.1em">&#8226; &#8226; &#8226;</div>
              <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:6px;background:#041B5F;border-left:4px solid #1149D8">
                <span style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:18px;color:#1149D8;min-width:20px">7</span>
                <span style="font-size:13px;color:#fff;font-weight:700;flex:1">Brimscombe &amp; Thrupp</span>
                <span style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:18px;color:#1149D8">51 pts</span>
              </div>
              <div style="display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:6px;background:#F9FAFB">
                <span style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:14px;color:#9CA3AF;min-width:20px">8</span>
                <span style="font-size:12px;color:#6B7280;flex:1">Alcester Town</span>
                <span style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:14px;color:#2D2D2D">48 pts</span>
              </div>
            </div>
            <button onclick="showPage('fixtures')" style="margin-top:14px;background:none;border:1px solid #1149D8;color:#1149D8;padding:8px 18px;border-radius:6px;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:13px;cursor:pointer;letter-spacing:.06em">Full Table &amp; All Fixtures &rarr;</button>
          </div>

          <!-- Source note -->
          <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:#F9FAFB;border-radius:6px;border:1px solid #E5E7EB">
            <span style="font-size:11px;color:#9CA3AF">Data from <a href="https://fulltime.thefa.com/index.html?divisionseason=671589236" target="_blank" style="color:#1149D8;font-weight:600">FA Full-Time</a> &mdash; Uhlsport Hellenic League Division One 2025/26</span>
          </div>
        </div>
      </div>

      <!-- ── RESERVES ── -->
      <div id="team-reserves" style="display:none">
        <div style="background:#041B5F;border-radius:8px;padding:20px 28px;margin-bottom:36px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
          <img src="" id="reserves-logo" style="width:56px;height:56px;border-radius:50%;background:#fff;border:2px solid #fff" alt="BTFC Reserves">
          <div>
            <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:24px;color:#fff;letter-spacing:.04em">BTFC Reserves</div>
            <div style="font-size:12px;color:rgba(255,255,255,.55)">Stroud &amp; District League Division 2 &mdash; Final Position: 7th</div>
          </div>
          <div style="margin-left:auto;display:flex;gap:12px;flex-wrap:wrap">
            <div style="background:rgba(255,255,255,.08);border-radius:6px;padding:10px 18px;text-align:center">
              <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:22px;color:#fff">7th</div>
              <div style="font-size:9px;color:rgba(255,255,255,.5);letter-spacing:.1em;text-transform:uppercase">Final Position</div>
            </div>
            <div style="background:rgba(255,255,255,.08);border-radius:6px;padding:10px 18px;text-align:center">
              <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:22px;color:#fff">31</div>
              <div style="font-size:9px;color:rgba(255,255,255,.5);letter-spacing:.1em;text-transform:uppercase">Points</div>
            </div>
            <div style="background:rgba(255,255,255,.08);border-radius:6px;padding:10px 18px;text-align:center">
              <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:22px;color:#1149D8">10W</div>
              <div style="font-size:9px;color:rgba(255,255,255,.5);letter-spacing:.1em;text-transform:uppercase">Wins</div>
            </div>
          </div>
        </div>

        <!-- Reserves Squad -->
        <div style="margin-bottom:40px">
          <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:28px;color:#2D2D2D;letter-spacing:.04em;margin-bottom:20px">Reserves Squad</div>
          <div class="squad-grid" id="reserves-grid"></div>
        </div>

        <!-- Reserves Fixtures -->
        <div style="margin-bottom:40px">
          <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:28px;color:#2D2D2D;letter-spacing:.04em;margin-bottom:20px">Reserves Results 2025/26</div>
          <div class="fixture-filters">
            <button class="filter-btn active" onclick="filterReserves('All',this)">All</button>
            <button class="filter-btn" onclick="filterReserves('Upcoming',this)">Upcoming</button>
            <button class="filter-btn" onclick="filterReserves('Results',this)">Results</button>
          </div>
          <div class="fixture-list" id="reserves-fixtures-list"></div>
        </div>

        <!-- Reserves League Table -->
        <div style="margin-bottom:40px">
          <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:28px;color:#2D2D2D;letter-spacing:.04em;margin-bottom:20px">Stroud &amp; District League Division 2 &mdash; Final Table</div>
          <div style="background:#041B5F;border-radius:8px;overflow:hidden">
            <div style="display:grid;grid-template-columns:40px 1fr 40px 40px 40px 40px 56px 52px;background:#1149D8;padding:10px 16px;gap:4px">
              <span style="font-weight:700;font-size:10px;color:#fff;letter-spacing:.1em;text-transform:uppercase;text-align:center">#</span>
              <span style="font-weight:700;font-size:10px;color:#fff;letter-spacing:.1em;text-transform:uppercase">Club</span>
              <span style="font-weight:700;font-size:10px;color:#fff;letter-spacing:.1em;text-transform:uppercase;text-align:center">P</span>
              <span style="font-weight:700;font-size:10px;color:#fff;letter-spacing:.1em;text-transform:uppercase;text-align:center">W</span>
              <span style="font-weight:700;font-size:10px;color:#fff;letter-spacing:.1em;text-transform:uppercase;text-align:center">D</span>
              <span style="font-weight:700;font-size:10px;color:#fff;letter-spacing:.1em;text-transform:uppercase;text-align:center">L</span>
              <span style="font-weight:700;font-size:10px;color:#fff;letter-spacing:.1em;text-transform:uppercase;text-align:center">GD</span>
              <span style="font-weight:700;font-size:10px;color:#fff;letter-spacing:.1em;text-transform:uppercase;text-align:center">Pts</span>
            </div>
            <div id="reserves-league-table"></div>
          </div>
        </div>

        <!-- Full-Time embed placeholder -->
        <div style="background:#fff;border:2px dashed #1149D8;border-radius:8px;padding:32px;text-align:center">
          <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:22px;color:#1149D8;letter-spacing:.04em;margin-bottom:8px">&#128279; FA Full-Time Live Feed &mdash; Reserves</div>
          <p style="font-size:13px;color:#6B7280;margin-bottom:20px">Paste the FA Full-Time embed code for the Reserves team here to auto-update fixtures and results.</p>
          <div style="background:#F2F2F2;border:1px solid #E5E7EB;border-radius:6px;padding:16px;font-family:monospace;font-size:12px;color:#6B7280;text-align:left;max-width:600px;margin:0 auto">
            &lt;!-- PASTE RESERVES FULL-TIME EMBED CODE HERE --&gt;
          </div>
        </div>
      </div>

      <!-- ── UNDER 17s ── -->
      <div id="team-u17" style="display:none">
        <div style="background:#041B5F;border-radius:8px;padding:20px 28px;margin-bottom:36px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
          <img src="" id="u17-logo" style="width:56px;height:56px;border-radius:50%;background:#fff;border:2px solid #fff" alt="BTFC U17s">
          <div>
            <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:24px;color:#fff;letter-spacing:.04em">BTFC Under 17s</div>
            <div style="font-size:12px;color:rgba(255,255,255,.55)">Youth Development &mdash; Under 17s Team</div>
          </div>
        </div>
        <div class="squad-grid" id="u17-grid"></div>
        <div style="margin-top:48px;background:#fff;border:2px dashed #1149D8;border-radius:8px;padding:32px;text-align:center">
          <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:22px;color:#1149D8;letter-spacing:.04em;margin-bottom:8px">&#128279; FA Full-Time Live Feed &mdash; Under 17s</div>
          <p style="font-size:13px;color:#6B7280;margin-bottom:20px">Paste the FA Full-Time embed code for the Under 17s team here.</p>
          <div style="background:#F2F2F2;border:1px solid #E5E7EB;border-radius:6px;padding:16px;font-family:monospace;font-size:12px;color:#6B7280;text-align:left;max-width:600px;margin:0 auto">
            &lt;!-- PASTE U17s FULL-TIME EMBED CODE HERE --&gt;
          </div>
        </div>
        <div style="margin-top:32px;background:#fff;border:1px solid #E5E7EB;border-radius:8px;padding:28px">
          <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:20px;color:#2D2D2D;letter-spacing:.04em;margin-bottom:16px">Under 17s Squad</div>
          <p style="font-size:13px;color:#9CA3AF">Under 17s squad list to be added. Interested in joining? Contact the club.</p>
        </div>
        <div style="margin-top:20px;background:#1149D8;border-radius:8px;padding:28px;text-align:center">
          <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:24px;color:#fff;letter-spacing:.04em;margin-bottom:8px">Interested in Youth Football?</div>
          <p style="font-size:13px;color:rgba(255,255,255,.7);margin-bottom:20px">We run youth teams from U6 to U18. Get in touch to find out more.</p>
          <button class="btn-primary" style="background:#fff;color:#1149D8" onclick="showPage('contact')">Contact Us</button>
        </div>
      </div>

    </div>
  </section>
</div>

<!-- FIXTURES -->
<div id="page-fixtures" class="page">
  <section class="section section-offwhite">
    <div class="section-inner-sm">
      <div class="section-head"><h2>Fixtures &amp; Results</h2><p>2025/26 Season &mdash; Uhlsport Hellenic League Division One</p><div class="section-bar"></div></div>

      <!-- Season summary -->
      <div style="display:flex;justify-content:center;margin-bottom:24px">
        <div style="background:#fff;border:1px solid #E5E7EB;border-radius:8px;padding:14px 24px;display:flex;gap:20px;align-items:center;flex-wrap:wrap;justify-content:center">
          <div style="text-align:center"><div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:28px;color:#2D2D2D;line-height:1">34</div><div style="font-size:10px;color:#9CA3AF;letter-spacing:.1em;text-transform:uppercase;margin-top:2px">Played</div></div>
          <div style="width:1px;height:36px;background:#E5E7EB"></div>
          <div style="text-align:center"><div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:28px;color:#22C55E;line-height:1">15</div><div style="font-size:10px;color:#9CA3AF;letter-spacing:.1em;text-transform:uppercase;margin-top:2px">Won</div></div>
          <div style="width:1px;height:36px;background:#E5E7EB"></div>
          <div style="text-align:center"><div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:28px;color:#F59E0B;line-height:1">6</div><div style="font-size:10px;color:#9CA3AF;letter-spacing:.1em;text-transform:uppercase;margin-top:2px">Drawn</div></div>
          <div style="width:1px;height:36px;background:#E5E7EB"></div>
          <div style="text-align:center"><div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:28px;color:#EF4444;line-height:1">13</div><div style="font-size:10px;color:#9CA3AF;letter-spacing:.1em;text-transform:uppercase;margin-top:2px">Lost</div></div>
          <div style="width:1px;height:36px;background:#E5E7EB"></div>
          <div style="text-align:center"><div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:28px;color:#041B5F;line-height:1">51</div><div style="font-size:10px;color:#9CA3AF;letter-spacing:.1em;text-transform:uppercase;margin-top:2px">Points</div></div>
          <div style="width:1px;height:36px;background:#E5E7EB"></div>
          <div style="text-align:center"><div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:28px;color:#041B5F;line-height:1">7th</div><div style="font-size:10px;color:#9CA3AF;letter-spacing:.1em;text-transform:uppercase;margin-top:2px">Position</div></div>
        </div>
      </div>

      <!-- Result key -->
      <div style="display:flex;gap:14px;justify-content:center;margin-bottom:20px;flex-wrap:wrap">
        <span style="display:flex;align-items:center;gap:6px;font-size:11px;color:#6B7280"><span style="width:14px;height:14px;border-radius:3px;background:#22C55E;display:inline-block"></span>Win</span>
        <span style="display:flex;align-items:center;gap:6px;font-size:11px;color:#6B7280"><span style="width:14px;height:14px;border-radius:3px;background:#F59E0B;display:inline-block"></span>Draw</span>
        <span style="display:flex;align-items:center;gap:6px;font-size:11px;color:#6B7280"><span style="width:14px;height:14px;border-radius:3px;background:#EF4444;display:inline-block"></span>Loss</span>
        <span style="display:flex;align-items:center;gap:6px;font-size:11px;color:#6B7280"><span style="width:14px;height:14px;border-radius:3px;background:#1149D8;display:inline-block"></span>Upcoming</span>
      </div>

      <div class="fixture-filters">
        <button class="filter-btn active" onclick="filterFixtures('All',this)">All</button>
        <button class="filter-btn" onclick="filterFixtures('Upcoming',this)">Upcoming</button>
        <button class="filter-btn" onclick="filterFixtures('Results',this)">Results</button>
      </div>
      <div class="fixture-list" id="fixtures-list"></div>
    </div>
  </section>
</div>

<!-- TICKETS -->
<div id="page-tickets" class="page">
  <section class="section section-offwhite">
    <div class="section-inner">
      <div class="section-head"><h2>Season Tickets</h2><p>Secure your seat for the 2026/27 season</p><div class="section-bar"></div></div>
      <div style="background:#041B5F;border-radius:8px;padding:20px 28px;margin-bottom:48px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
        <div style="font-size:32px">&#127903;</div>
        <div style="flex:1"><div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:22px;color:#fff;letter-spacing:.04em;margin-bottom:4px">2026/27 Season Tickets On Sale Now</div><div style="font-size:13px;color:rgba(255,255,255,.6)">Adult Early Bird &pound;90 &middot; Concession Early Bird &pound;70 &middot; Secure payment via <strong style="color:#fff">Zettle</strong> &middot; All major cards accepted</div></div>
        <div style="background:#1149D8;border-radius:6px;padding:10px 20px;text-align:center"><div style="font-size:9px;color:rgba(255,255,255,.6);letter-spacing:.12em;text-transform:uppercase;margin-bottom:2px">Powered by</div><div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:18px;color:#fff;letter-spacing:.06em">Zettle</div></div>
      </div>
      <div class="ticket-grid" id="ticket-grid"></div>
      <div id="checkout-box" style="display:none"></div>
      <div style="margin-top:56px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px">
        <div class="info-card"><div class="info-card-title">Can I pay in instalments?</div><div class="info-card-body">Not currently &mdash; season tickets must be paid in full at time of purchase.</div></div>
        <div class="info-card"><div class="info-card-title">How do I collect my ticket?</div><div class="info-card-body">After payment you will receive an email with your digital season ticket. Simply show it on your phone at the gate or print it at home on any printer &mdash; both work perfectly fine.</div></div>
        <div class="info-card"><div class="info-card-title">Refund policy</div><div class="info-card-body">Please contact us within 14 days of purchase. Subject to our terms and conditions.</div></div>
        <div class="info-card"><div class="info-card-title">Is my payment secure?</div><div class="info-card-body">Yes. All payments processed by Zettle (a PayPal company) using bank-grade encryption.</div></div>
      </div>
    </div>
  </section>
</div>

<!-- MATCHDAY -->
<div id="page-matchday" class="page">
  <section class="section section-offwhite">
    <div class="section-inner" style="max-width:1000px">
      <div class="section-head"><h2>Matchday Guide</h2><p>Everything you need for matchday at The Jessons Meadow</p><div class="section-bar"></div></div>
      <div style="background:#041B5F;border-radius:8px;padding:28px 32px;margin-bottom:40px;display:flex;gap:24px;align-items:center;flex-wrap:wrap">
        <div style="flex:1"><span class="pill" style="background:#1149D8">Next Home Game</span><div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:32px;color:#fff;letter-spacing:.04em;margin:10px 0 4px">Pre-Season 2026/27 &mdash; Fixtures TBC</div><div style="font-size:13px;color:rgba(255,255,255,.55)">&#128197; Season Complete &middot; &#9200; 15:00 &middot; &#128205; The Meadow</div></div>
        <button class="btn-primary" onclick="showPage('tickets')">Get Tickets</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px">
        <div class="info-card"><div class="info-card-icon">&#128506;</div><div class="info-card-title">Parking</div><div class="info-card-body">Free parking in the main car park off Station Road. Overflow at the leisure centre (5 min walk).</div></div>
        <div class="info-card"><div class="info-card-icon">&#128652;</div><div class="info-card-title">Getting Here</div><div class="info-card-body">Bus routes 14 and 22 stop outside the ground. Brimscombe station is a 10-minute walk.</div></div>
        <div class="info-card"><div class="info-card-icon">&#127828;</div><div class="info-card-title">Food &amp; Drink</div><div class="info-card-body">Hot food, snacks and drinks from the clubhouse and pitch-side kiosk from 1 hour before kick-off.</div></div>
        <div class="info-card"><div class="info-card-icon">&#9855;</div><div class="info-card-title">Accessibility</div><div class="info-card-body">Wheelchair spaces available in the main stand. Please contact us in advance to arrange assistance.</div></div>
        <div class="info-card"><div class="info-card-icon">&#127915;</div><div class="info-card-title">Tickets</div><div class="info-card-body">Match tickets available on the gate. Season ticket holders must present their card. Under 5s free.</div></div>
        <div class="info-card"><div class="info-card-icon">&#128203;</div><div class="info-card-title">Programme</div><div class="info-card-body">Official matchday programme &pound;2. Free with all season tickets. Available digitally on our website.</div></div>
      </div>
    </div>
  </section>
</div>

<!-- SPONSORS -->
<div id="page-sponsors" class="page">
  <section class="section section-offwhite">
    <div class="section-inner">
      <div class="section-head"><h2>Club Sponsors</h2><p>Our valued club partners and sponsors</p><div class="section-bar"></div></div>
      <!-- Ground Sponsor -->
      <div class="tier-div"><div class="tier-line" style="background:linear-gradient(to right,#D4AF37,transparent)"></div><div class="tier-badge" style="background:rgba(212,175,55,.08);border:1px solid rgba(212,175,55,.25)"><span style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:15px;color:#D4AF37;letter-spacing:.06em">&#127967; GROUND SPONSOR</span></div><div class="tier-line" style="background:linear-gradient(to left,#D4AF37,transparent)"></div></div>
      <p style="text-align:center;font-size:12px;color:#9CA3AF;margin-bottom:24px">Official ground sponsor &mdash; The Jessons Meadow naming rights &amp; maximum visibility</p>
      <div class="sponsor-grid">
        <div class="sponsor-card" style="width:320px;padding:28px 24px">
          <div class="scard-bar" style="background:#D4AF37;height:5px"></div>
          <div class="scard-logo" style="height:90px;display:flex;align-items:center;justify-content:center;margin:12px 0">
            <img src="/jessons-logo.png" alt="Jessons Real Estate" style="max-height:100%;max-width:260px;object-fit:contain">
          </div>
          <div class="scard-name" style="font-size:22px">Jessons Real Estate</div>
          <div class="scard-desc" style="color:#D4AF37">Official Ground Sponsor</div>
          <div class="scard-impr" style="background:rgba(212,175,55,.08);border:1px solid rgba(212,175,55,.25);margin-top:10px">
            <div class="scard-impr-val" style="color:#D4AF37">&#127967; The Jessons Meadow</div>
            <div class="scard-impr-label">Ground Naming Rights</div>
          </div>
          <button class="scard-btn" style="border:1px solid #D4AF37;color:#D4AF37;margin-top:10px">Visit Website &rarr;</button>
        </div>
      </div>

      <!-- First Team Sponsor -->
      <div class="tier-div" style="margin-top:16px"><div class="tier-line" style="background:linear-gradient(to right,#CBD5E1,transparent)"></div><div class="tier-badge" style="background:rgba(203,213,225,.08);border:1px solid rgba(203,213,225,.2)"><span style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:15px;color:#CBD5E1;letter-spacing:.06em">&#9917; FIRST TEAM SPONSOR</span></div><div class="tier-line" style="background:linear-gradient(to left,#CBD5E1,transparent)"></div></div>
      <p style="text-align:center;font-size:12px;color:#9CA3AF;margin-bottom:24px">First team sponsor &mdash; shirt, matchday graphics, homepage &amp; all club materials</p>
      <div class="sponsor-grid">
        <div class="sponsor-card" style="width:280px;padding:24px 20px">
          <div class="scard-bar" style="background:#CBD5E1;height:4px"></div>
          <div class="scard-logo" style="height:70px;display:flex;align-items:center;justify-content:center;margin:10px 0">
            <img src="/gel-logo.png" alt="GEL Engineering" style="max-height:100%;max-width:200px;object-fit:contain">
          </div>
          <div class="scard-name" style="font-size:20px">GEL Engineering</div>
          <div class="scard-desc" style="color:#CBD5E1">First Team Sponsor</div>
          <div class="scard-impr" style="background:rgba(203,213,225,.08);border:1px solid rgba(203,213,225,.2);margin-top:8px">
            <div class="scard-impr-val" style="color:#CBD5E1">First XI</div>
            <div class="scard-impr-label">Kit &amp; Matchday Materials</div>
          </div>
          <button class="scard-btn" style="border:1px solid #CBD5E1;color:#CBD5E1;margin-top:8px">Visit Website &rarr;</button>
        </div>
      </div>

      <!-- OLD MAIN SPONSOR (now replaced above) -->
      <div class="sponsor-grid" style="display:none">
        <div class="sponsor-card" style="width:290px"><div class="scard-bar" style="background:#D4AF37"></div><div class="scard-logo" style="height:60px"><img src="/gel-logo.png" alt="GEL Engineering" style="max-height:100%;max-width:180px;object-fit:contain"></div><div class="scard-name" style="font-size:20px">GEL Engineering</div><div class="scard-desc" style="color:#D4AF37">First Team Sponsor</div><div class="scard-since">Since 2021</div><div class="scard-impr" style="background:rgba(212,175,55,.08);border:1px solid rgba(212,175,55,.25)"><div class="scard-impr-val" style="color:#D4AF37">14,200</div><div class="scard-impr-label">Monthly Impressions</div></div><button class="scard-btn" style="border:1px solid #D4AF37;color:#D4AF37">Visit Website &rarr;</button></div>
      </div>
      <!-- Reserves Sponsor -->
      <div class="tier-div" style="margin-top:8px"><div class="tier-line" style="background:linear-gradient(to right,#2563FF,transparent)"></div><div class="tier-badge" style="background:rgba(37,99,255,.07);border:1px solid rgba(37,99,255,.18)"><span style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:15px;color:#2563FF;letter-spacing:.06em">&#9917; RESERVES SPONSOR</span></div><div class="tier-line" style="background:linear-gradient(to left,#2563FF,transparent)"></div></div>
      <p style="text-align:center;font-size:12px;color:#9CA3AF;margin-bottom:24px">Reserves sponsor &mdash; shirt, matchday materials &amp; reserve team coverage</p>
      <div class="sponsor-grid">
        <div class="sponsor-card" style="width:260px"><div class="scard-bar" style="background:#2563FF"></div>
          <div class="scard-logo" style="height:60px;display:flex;align-items:center;justify-content:center">
            <div style="background:#F2F2F2;border:2px dashed #D1D5DB;border-radius:8px;padding:10px 20px;text-align:center;width:100%">
              <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:12px;color:#9CA3AF;letter-spacing:.06em">RESERVES SPONSOR LOGO</div>
              <div style="font-size:10px;color:#D1D5DB;margin-top:3px">Upload when confirmed</div>
            </div>
          </div>
          <div class="scard-name" style="font-size:17px;margin-top:8px">Reserves Sponsor TBC</div>
          <div class="scard-desc" style="color:#2563FF">Reserves Sponsor</div>
        </div>
      </div>

      <!-- U17s Kit Sponsor -->
      <div class="tier-div" style="margin-top:8px"><div class="tier-line" style="background:linear-gradient(to right,#166534,transparent)"></div><div class="tier-badge" style="background:rgba(22,101,52,.07);border:1px solid rgba(22,101,52,.18)"><span style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:15px;color:#166534;letter-spacing:.06em">&#9917; UNDER 17s SPONSOR</span></div><div class="tier-line" style="background:linear-gradient(to left,#166534,transparent)"></div></div>
      <p style="text-align:center;font-size:12px;color:#9CA3AF;margin-bottom:24px">Under 17s sponsor &mdash; shirt, youth development &amp; matchday coverage</p>
      <div class="sponsor-grid">
        <div class="sponsor-card" style="width:260px"><div class="scard-bar" style="background:#166534"></div>
          <div class="scard-logo" style="height:60px;display:flex;align-items:center;justify-content:center">
            <div style="background:#F2F2F2;border:2px dashed #D1D5DB;border-radius:8px;padding:10px 20px;text-align:center;width:100%">
              <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:12px;color:#9CA3AF;letter-spacing:.06em">UNDER 17s SPONSOR LOGO</div>
              <div style="font-size:10px;color:#D1D5DB;margin-top:3px">Upload when confirmed</div>
            </div>
          </div>
          <div class="scard-name" style="font-size:17px;margin-top:8px">U17s Sponsor TBC</div>
          <div class="scard-desc" style="color:#166534">Under 17s Sponsor</div>
        </div>
      </div>
      <div class="tier-div"><div class="tier-line" style="background:linear-gradient(to right,#2563FF,transparent)"></div><div class="tier-badge" style="background:rgba(17,73,216,.07);border:1px solid rgba(17,73,216,.18)"><span style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:15px;color:#2563FF;letter-spacing:.06em">GOLD PARTNERS</span></div><div class="tier-line" style="background:linear-gradient(to left,#2563FF,transparent)"></div></div>
      <div class="sponsor-grid">
        <div class="sponsor-card" style="width:195px"><div class="scard-bar" style="background:#2563FF"></div><div class="scard-logo" style="height:36px;font-size:32px">&#127807;</div><div class="scard-name" style="font-size:15px">Greenleaf Landscaping</div><div class="scard-desc" style="color:#2563FF">Gold Partner</div><button class="scard-btn" style="border:1px solid #2563FF;color:#2563FF;margin-top:8px">Visit &rarr;</button></div>
        <div class="sponsor-card" style="width:195px"><div class="scard-bar" style="background:#2563FF"></div><div class="scard-logo" style="height:36px;font-size:32px">&#128424;</div><div class="scard-name" style="font-size:15px">Swift Print Co.</div><div class="scard-desc" style="color:#2563FF">Gold Partner</div><button class="scard-btn" style="border:1px solid #2563FF;color:#2563FF;margin-top:8px">Visit &rarr;</button></div>
        <div class="sponsor-card" style="width:195px"><div class="scard-bar" style="background:#2563FF"></div><div class="scard-logo" style="height:36px;font-size:32px">&#128249;</div><div class="scard-name" style="font-size:15px">Elite Bootroom</div><div class="scard-desc" style="color:#2563FF">Gold Partner</div><button class="scard-btn" style="border:1px solid #2563FF;color:#2563FF;margin-top:8px">Visit &rarr;</button></div>
      </div>
      <div class="tier-div"><div class="tier-line" style="background:linear-gradient(to right,#6B7280,transparent)"></div><div class="tier-badge" style="background:rgba(107,114,128,.06);border:1px solid rgba(107,114,128,.15)"><span style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:15px;color:#6B7280;letter-spacing:.06em">CLUB PARTNERS</span></div><div class="tier-line" style="background:linear-gradient(to left,#6B7280,transparent)"></div></div>
      <div class="sponsor-grid">
        <div class="sponsor-card" style="width:170px"><div class="scard-bar" style="background:#6B7280"></div><div class="scard-logo" style="height:32px;font-size:28px">&#127866;</div><div class="scard-name" style="font-size:14px">The Crown Inn</div><div class="scard-desc" style="color:#6B7280">Club Partner</div></div>
        <div class="sponsor-card" style="width:170px"><div class="scard-bar" style="background:#6B7280"></div><div class="scard-logo" style="height:32px;font-size:28px">&#128187;</div><div class="scard-name" style="font-size:14px">TechFix IT</div><div class="scard-desc" style="color:#6B7280">Club Partner</div></div>
        <div class="sponsor-card" style="width:170px"><div class="scard-bar" style="background:#6B7280"></div><div class="scard-logo" style="height:32px;font-size:28px">&#129463;</div><div class="scard-name" style="font-size:14px">Riverside Dental</div><div class="scard-desc" style="color:#6B7280">Club Partner</div></div>
        <div class="sponsor-card" style="width:170px"><div class="scard-bar" style="background:#6B7280"></div><div class="scard-logo" style="height:32px;font-size:28px">&#128295;</div><div class="scard-name" style="font-size:14px">County Garage</div><div class="scard-desc" style="color:#6B7280">Club Partner</div></div>
      </div>
      <div class="sponsor-cta">
        <span class="pill" style="background:#1149D8">Sponsorship Available</span>
        <h3>Become a Club Sponsor</h3>
        <p>Reach 2,000+ local families and supporters. Packages from &pound;250/season.</p>
        <button class="btn-primary" onclick="showPage('contact')">Enquire Now</button>
      </div>
    </div>
  </section>
</div>

<!-- CLUB -->
<div id="page-club" class="page">
  <section class="section section-offwhite">
    <div class="section-inner" style="max-width:900px">
      <div class="section-head"><h2>Club Information</h2><p>About Brimscombe &amp; Thrupp FC</p><div class="section-bar"></div></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px">
        <div class="info-card"><div class="info-card-icon">&#127967;</div><div class="info-card-title">The Ground</div><div class="info-card-body">The Jessons Meadow has been home since 1886. Set in the beautiful Cotswold valley, holding 1,200 with covered seating.</div></div>
        <div class="info-card"><div class="info-card-icon">&#128220;</div><div class="info-card-title">Club History</div><div class="info-card-body">Formed through the merger of Brimscombe FC (est. 1886) and Thrupp FC, The Lilywhites are one of Gloucestershire's oldest clubs. Brimscombe FC were founder members of the Mid-Gloucestershire League in 1894. Under chairman Neil Long and the Long-Baker family, the club won four promotions in six years, claiming the Hellenic League Division One West title in 2012-13 and reaching the Premier Division. The club is now rebuilding in Hellenic League Division One with ambitions to reach the Southern League.</div></div>
        <div class="info-card"><div class="info-card-icon">&#128101;</div><div class="info-card-title">Club Officials</div><div class="info-card-body">Chairman: Neil Long &middot; Secretary: Sarah Mills &middot; Manager: Tim Bond &middot; Welfare Officer: Mike Hill</div></div>
        <div class="info-card"><div class="info-card-icon">&#129309;</div><div class="info-card-title">Community</div><div class="info-card-body">Youth teams from U6 to U18 and walking football. All welcome &mdash; contact us to get involved.</div></div>
        <div class="info-card"><div class="info-card-icon">&#128196;</div><div class="info-card-title">Policies</div><div class="info-card-body">Safeguarding, privacy and equal opportunities policies available on request from the club secretary.</div></div>
        <div class="info-card"><div class="info-card-icon">&#128231;</div><div class="info-card-title">Get In Touch</div><div class="info-card-body">Email: info@brimscombeandthruppfc.co.uk &middot; Phone: 07814 854108 &middot; The Jessons Meadow, London Road, Brimscombe, Stroud, GL5 2SH</div></div>
      </div>
    </div>
  </section>
</div>

<!-- CONTACT -->
<div id="page-contact" class="page">
  <section class="section section-navy">
    <div class="section-inner" style="max-width:680px">
      <div class="section-head light"><h2>Contact Us</h2><p>Get in touch with the club</p><div class="section-bar"></div></div>
      <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:36px" id="contact-form-wrap">
        <div class="contact-field" style="margin-bottom:0"><label class="form-label" style="color:rgba(255,255,255,.4)">Full Name</label><input class="contact-input" placeholder="John Smith"></div>
        <div class="contact-field" style="margin-bottom:0"><label class="form-label" style="color:rgba(255,255,255,.4)">Email Address</label><input class="contact-input" type="email" placeholder="john@example.com"></div>
        <label class="form-label" style="color:rgba(255,255,255,.4)">Subject</label>
        <select class="contact-input" style="background:#0B1E56"><option>General</option><option>Player Registration</option><option>Sponsorship Enquiry</option><option>Ticketing</option><option>Volunteering</option><option>Press &amp; Media</option></select>
        <label class="form-label" style="color:rgba(255,255,255,.4)">Message</label>
        <textarea class="contact-input" rows="5" style="resize:vertical"></textarea>
        <button style="width:100%;background:#1149D8;color:#fff;border:none;padding:15px;border-radius:6px;font-family:'Montserrat',sans-serif;font-weight:800;font-size:13px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;margin-top:8px" onclick="sendMsg()">Send Message</button>
      </div>
    </div>
  </section>
</div>


<!-- SHOP PAGE -->
<div id="page-shop" class="page">
  <section class="section section-offwhite">
    <div class="section-inner" style="max-width:1000px">
      <div class="section-head"><h2>Club Shop</h2><p>Official Brimscombe &amp; Thrupp FC merchandise</p><div class="section-bar"></div></div>

      <!-- Batemans Sports banner -->
      <div style="background:#041B5F;border-radius:8px;padding:32px 36px;margin-bottom:48px;display:flex;align-items:center;gap:24px;flex-wrap:wrap">
        <div style="font-size:48px">&#128722;</div>
        <div style="flex:1">
          <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:28px;color:#fff;letter-spacing:.04em;margin-bottom:6px">Official BTFC Merchandise</div>
          <div style="font-size:13px;color:rgba(255,255,255,.6);margin-bottom:16px">Our official club shop is powered by Batemans Sports. All items feature the official BTFC badge and are made to order.</div>
          <div style="background:rgba(255,255,255,.08);border-radius:6px;padding:8px 14px;display:inline-block;font-size:11px;color:rgba(255,255,255,.5);margin-bottom:16px">&#9432; Please allow 3-4 weeks for delivery. Items with club badge or sponsor logo are non-returnable.</div>
          <div>
            <a href="https://www.batemanssports.co.uk/collections/club-shops-football-brimscombe-thrupp-fc" target="_blank" style="display:inline-block;background:#1149D8;color:#fff;padding:14px 28px;border-radius:6px;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:16px;letter-spacing:.06em;text-decoration:none;text-transform:uppercase">Visit Club Shop &rarr;</a>
          </div>
        </div>
      </div>

      <!-- Product categories -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-bottom:48px">
        <div class="info-card" style="text-align:center;cursor:pointer" onclick="window.open(&quot;https://www.batemanssports.co.uk/collections/club-shops-football-brimscombe-thrupp-fc&quot;,&quot;_blank&quot;)">
          <div style="font-size:48px;margin-bottom:12px">&#128083;</div>
          <div class="info-card-title">Matchday Kit</div>
          <div class="info-card-body">Home &amp; away shirts, shorts and socks. Official Joma kit.</div>
          <div style="margin-top:12px"><span style="color:#1149D8;font-weight:700;font-size:12px">Shop Now &rarr;</span></div>
        </div>
        <div class="info-card" style="text-align:center;cursor:pointer" onclick="window.open(&quot;https://www.batemanssports.co.uk/collections/club-shops-football-brimscombe-thrupp-fc&quot;,&quot;_blank&quot;)">
          <div style="font-size:48px;margin-bottom:12px">&#129354;</div>
          <div class="info-card-title">Training Wear</div>
          <div class="info-card-body">Training tops, hoodies, jackets and warm-up gear.</div>
          <div style="margin-top:12px"><span style="color:#1149D8;font-weight:700;font-size:12px">Shop Now &rarr;</span></div>
        </div>
        <div class="info-card" style="text-align:center;cursor:pointer" onclick="window.open(&quot;https://www.batemanssports.co.uk/collections/club-shops-football-brimscombe-thrupp-fc&quot;,&quot;_blank&quot;)">
          <div style="font-size:48px;margin-bottom:12px">&#127925;</div>
          <div class="info-card-title">Managers Jacket</div>
          <div class="info-card-body">Joma Managers Trivor Winter Bench Jacket in black. From &pound;61.</div>
          <div style="margin-top:12px"><span style="color:#1149D8;font-weight:700;font-size:12px">Shop Now &rarr;</span></div>
        </div>
        <div class="info-card" style="text-align:center;cursor:pointer" onclick="window.open(&quot;https://www.batemanssports.co.uk/collections/club-shops-football-brimscombe-thrupp-fc&quot;,&quot;_blank&quot;)">
          <div style="font-size:48px;margin-bottom:12px">&#127941;</div>
          <div class="info-card-title">Accessories</div>
          <div class="info-card-body">Scarves, hats, bags and other official BTFC merchandise.</div>
          <div style="margin-top:12px"><span style="color:#1149D8;font-weight:700;font-size:12px">Shop Now &rarr;</span></div>
        </div>
      </div>

      <!-- Custom printing info -->
      <div style="background:#fff;border:1px solid #E5E7EB;border-radius:8px;padding:28px 32px;margin-bottom:32px">
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:22px;color:#2D2D2D;letter-spacing:.04em;margin-bottom:16px">&#9999; Custom Printing &amp; Personalisation</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px">
          <div style="display:flex;gap:10px;align-items:flex-start">
            <span style="color:#1149D8;font-weight:700;font-size:16px;flex-shrink:0">&#10003;</span>
            <span style="font-size:13px;color:#6B7280">Name &amp; number printing on shirts</span>
          </div>
          <div style="display:flex;gap:10px;align-items:flex-start">
            <span style="color:#1149D8;font-weight:700;font-size:16px;flex-shrink:0">&#10003;</span>
            <span style="font-size:13px;color:#6B7280">Official BTFC club badge on all items</span>
          </div>
          <div style="display:flex;gap:10px;align-items:flex-start">
            <span style="color:#1149D8;font-weight:700;font-size:16px;flex-shrink:0">&#10003;</span>
            <span style="font-size:13px;color:#6B7280">Sponsor logos on request</span>
          </div>
          <div style="display:flex;gap:10px;align-items:flex-start">
            <span style="color:#1149D8;font-weight:700;font-size:16px;flex-shrink:0">&#10003;</span>
            <span style="font-size:13px;color:#6B7280">Junior sizes available</span>
          </div>
        </div>
        <div style="margin-top:16px;padding:12px 16px;background:#FEF3C7;border-radius:6px;font-size:12px;color:#92400E">
          &#9888; Please allow 3-4 weeks for delivery. Personalised items cannot be returned.
        </div>
      </div>

      <!-- CTA -->
      <div style="text-align:center;background:#041B5F;border-radius:8px;padding:40px">
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:30px;color:#fff;letter-spacing:.04em;margin-bottom:8px">Support Your Club</div>
        <div style="font-size:13px;color:rgba(255,255,255,.6);margin-bottom:24px;max-width:440px;margin-left:auto;margin-right:auto">Every purchase helps support Brimscombe &amp; Thrupp FC. Wear your colours with pride.</div>
        <a href="https://www.batemanssports.co.uk/collections/club-shops-football-brimscombe-thrupp-fc" target="_blank" style="display:inline-block;background:#1149D8;color:#fff;padding:16px 36px;border-radius:6px;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:18px;letter-spacing:.06em;text-decoration:none;text-transform:uppercase;box-shadow:0 8px 28px rgba(17,73,216,.45)">Visit Club Shop &rarr;</a>
      </div>

    </div>
  </section>
</div>

<footer>
  <div class="footer-grid">
    <div>
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
        <img src="/crest.png" style="width:56px;height:56px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 2px #041B5F" alt="BTFC">
        <div><div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:20px;color:#fff;letter-spacing:.05em;line-height:1">BRIMSCOMBE</div><div style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:20px;color:#fff;letter-spacing:.05em;line-height:1">&amp; THRUPP FC</div></div>
      </div>
      <p style="font-size:12px;color:rgba(255,255,255,.3);line-height:1.7;margin-bottom:16px">Est. 1886 &middot; The Lilywhites</p>
      <div class="social-icons">
        <div class="social-icon" onclick="window.open('https://x.com/Btfcthemeadow','_blank')" title="Follow us on X" style="cursor:pointer">&#120143;</div>
        <div class="social-icon" onclick="window.open('https://www.facebook.com/BrimscombeandThruppFC/','_blank')" title="Facebook" style="cursor:pointer">f</div>
        <div class="social-icon" onclick="window.open('https://www.instagram.com/brimscombeandthruppfc/','_blank')" title="Instagram" style="cursor:pointer">in</div>
        <div class="social-icon">&#9654;</div>
      </div>
    </div>
    <div>
      <div class="footer-label">Navigation</div>
      <button class="footer-link" onclick="showPage('news')">News</button>
      <button class="footer-link" onclick="showPage('teams')">Teams</button>
      <button class="footer-link" onclick="showPage('fixtures')">Matches</button>
      <button class="footer-link" onclick="showPage('tickets')">Tickets</button>
      <button class="footer-link" onclick="showPage('matchday')">Matchday</button>
      <button class="footer-link" onclick="showPage('sponsors')">Sponsors</button>
      <button class="footer-link" onclick="showPage('club')">Club Info</button>
      <button class="footer-link" onclick="showPage('shop')">Club Shop</button>
      <button class="footer-link" onclick="showPage('contact')">Contact</button>
    </div>
    <div>
      <div class="footer-label">Kit Sponsor</div>
      <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:6px;padding:10px 12px;margin-bottom:10px;display:flex;align-items:center;gap:10px">
        <img src="/gel-logo.png" style="height:28px;object-fit:contain" alt="GEL Engineering">
        <div><div style="font-weight:700;font-size:12px;color:#fff">GEL Engineering</div><div style="font-size:10px;color:#D4AF37">First Team Sponsor</div></div>
      </div>
      <button class="btn-primary" onclick="showPage('tickets')" style="width:100%;margin-top:12px">&#127915; Buy Season Tickets</button>
    </div>
    <div>
      <div class="footer-label">Contact</div>
      <div class="footer-contact">&#128205; The Jessons Meadow, London Road, Brimscombe, GL5 2SH</div>
      <div class="footer-contact">&#128231; info@brimscombeandthruppfc.co.uk</div>
      <div class="footer-contact">&#128222; 07814 854108</div>
      <div class="footer-contact">&#128336; Mon&ndash;Fri 9am&ndash;5pm</div>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="footer-copy">&copy; 2026 Brimscombe &amp; Thrupp FC. All rights reserved.</div>
    <div style="display:flex;gap:18px">
      <span class="footer-copy">Privacy Policy</span>
      <span class="footer-copy">Terms of Use</span>
      <span class="footer-copy">Cookie Policy</span>
    </div>
  </div>
</footer>

<script>
var LOGO_URL = "/crest.png";
var GEL_URL = "/gel-logo.png";
var ZETTLE   = "https://pay.izettle.com/?gpy9xFwrb";

var FIXTURES = [
  {date:"2026-04-18",home:"BTFC",               away:"FC Stratford",          venue:"The Jessons Meadow",                  time:"15:00", result:"1-2",  type:"League"},
  {date:"2026-04-14",home:"Thame Utd Res",      away:"BTFC",                  venue:"Thame United Ground",         time:"19:45", result:"0-2",  type:"League"},
  {date:"2026-04-11",home:"Ludlow Town",        away:"BTFC",                  venue:"Ludlow Ground",               time:"15:00", result:"1-1",  type:"League"},
  {date:"2026-04-09",home:"Malmesbury Vic",     away:"BTFC",                  venue:"Malmesbury Ground",           time:"19:45", result:"3-0",  type:"League"},
  {date:"2026-04-04",home:"BTFC",               away:"Wellington",            venue:"The Jessons Meadow",                  time:"15:00", result:"5-1",  type:"League"},
  {date:"2026-03-28",home:"Redditch Borough",   away:"BTFC",                  venue:"Redditch Ground",             time:"15:00", result:"0-3",  type:"League"},
  {date:"2026-03-24",home:"Clanfield 85",       away:"BTFC",                  venue:"Clanfield Ground",            time:"19:45", result:"0-4",  type:"League"},
  {date:"2026-03-21",home:"BTFC",               away:"Woodford United",       venue:"The Jessons Meadow",                  time:"15:00", result:"4-1",  type:"League"},
  {date:"2026-03-17",home:"Woodford United",    away:"BTFC",                  venue:"Woodford Ground",             time:"19:45", result:"0-2",  type:"League"},
  {date:"2026-03-07",home:"BTFC",               away:"Bewdley Town",          venue:"The Jessons Meadow",                  time:"15:00", result:"0-3",  type:"League"},
  {date:"2026-02-21",home:"BTFC",               away:"Redditch Borough",      venue:"The Jessons Meadow",                  time:"15:00", result:"0-0",  type:"League"},
  {date:"2026-02-14",home:"Wantage Town",       away:"BTFC",                  venue:"Wantage Ground",              time:"15:00", result:"2-1",  type:"League"},
  {date:"2026-02-10",home:"BTFC",               away:"Carterton",             venue:"The Jessons Meadow",                  time:"19:45", result:"6-1",  type:"League"},
  {date:"2026-01-24",home:"BTFC",               away:"Cheltenham Saracens",   venue:"The Jessons Meadow",                  time:"15:00", result:"1-0",  type:"League"},
  {date:"2026-01-10",home:"Wellington",         away:"BTFC",                  venue:"Wellington Ground",           time:"15:00", result:"3-2",  type:"League"},
  {date:"2026-01-02",home:"BTFC",               away:"Stonehouse Town",       venue:"The Jessons Meadow",                  time:"19:45", result:"1-1",  type:"League"},
  {date:"2025-12-27",home:"Shortwood United",   away:"BTFC",                  venue:"Shortwood Ground",            time:"15:00", result:"3-0",  type:"League"},
  {date:"2025-12-13",home:"Bewdley Town",       away:"BTFC",                  venue:"Bewdley Ground",              time:"15:00", result:"1-0",  type:"League"},
  {date:"2025-12-06",home:"BTFC",               away:"Newent Town",           venue:"The Jessons Meadow",                  time:"15:00", result:"2-1",  type:"League"},
  {date:"2025-11-22",home:"BTFC",               away:"Clanfield 85",          venue:"The Jessons Meadow",                  time:"15:00", result:"2-2",  type:"League"},
  {date:"2025-11-15",home:"Alcester Town",      away:"BTFC",                  venue:"Alcester Ground",             time:"15:00", result:"4-3",  type:"League"},
  {date:"2025-11-08",home:"Cheltenham Saracens",away:"BTFC",                  venue:"Cheltenham Saracens Ground",  time:"15:00", result:"2-2",  type:"League"},
  {date:"2025-11-04",home:"Shortwood United",   away:"BTFC",                  venue:"Shortwood Ground",            time:"19:45", result:"3-0",  type:"GFA Trophy"},
  {date:"2025-11-01",home:"BTFC",               away:"Highworth Town",        venue:"The Jessons Meadow",                  time:"15:00", result:"1-2",  type:"Cup"},
  {date:"2025-10-18",home:"Chipping Sodbury Town",away:"BTFC",                venue:"Chipping Sodbury Ground",     time:"15:00", result:"2-1",  type:"League"},
  {date:"2025-10-14",home:"BTFC",               away:"Chipping Sodbury Town", venue:"The Jessons Meadow",                  time:"19:45", result:"1-4",  type:"Floodlit Cup"},
  {date:"2025-10-11",home:"BTFC",               away:"Kidlington FC Dev",     venue:"The Jessons Meadow",                  time:"15:00", result:"10-0", type:"Cup"},
  {date:"2025-10-04",home:"BTFC",               away:"Thame United Reserves", venue:"The Jessons Meadow",                  time:"15:00", result:"2-1",  type:"League"},
  {date:"2025-09-27",home:"BTFC",               away:"Shortwood United",      venue:"The Jessons Meadow",                  time:"15:00", result:"1-1",  type:"Cup"},
  {date:"2025-09-20",home:"BTFC",               away:"Ludlow Town",           venue:"The Jessons Meadow",                  time:"15:00", result:"1-2",  type:"League"},
  {date:"2025-09-13",home:"BTFC",               away:"Malmesbury Victoria",   venue:"The Jessons Meadow",                  time:"15:00", result:"0-0",  type:"League"},
  {date:"2025-09-06",home:"Carterton",          away:"BTFC",                  venue:"Carterton Ground",            time:"15:00", result:"0-2",  type:"League"},
  {date:"2025-08-30",home:"BTFC",               away:"Alcester Town",         venue:"The Jessons Meadow",                  time:"15:00", result:"1-0",  type:"League"},
  {date:"2025-08-25",home:"FC Stratford",       away:"BTFC",                  venue:"FC Stratford Ground",         time:"15:00", result:"3-4",  type:"League"},
  {date:"2025-08-23",home:"Avonmouth",          away:"BTFC",                  venue:"Avonmouth Ground",            time:"15:00", result:"3-0",  type:"FA Vase"},
  {date:"2025-08-16",home:"BTFC",               away:"Shortwood United",      venue:"The Jessons Meadow",                  time:"15:00", result:"0-3",  type:"League"},
  {date:"2025-08-12",home:"Newent Town",        away:"BTFC",                  venue:"Newent Ground",               time:"19:45", result:"2-0",  type:"League"},
  {date:"2025-08-09",home:"Stonehouse Town",    away:"BTFC",                  venue:"Stonehouse Ground",           time:"15:00", result:"3-0",  type:"League"},
  {date:"2025-08-05",home:"BTFC",               away:"Chipping Sodbury Town", venue:"The Jessons Meadow",                  time:"19:45", result:"3-2",  type:"League"},
  {date:"2025-08-02",home:"BTFC",               away:"Wantage Town",          venue:"The Jessons Meadow",                  time:"15:00", result:"3-1",  type:"League"}
];

var LEAGUE = [
  {pos:1,  team:"FC Stratford",          p:34, w:26, d:3,  l:5,  gd:"+52", pts:81},
  {pos:2,  team:"Wantage Town",           p:34, w:21, d:9,  l:4,  gd:"+51", pts:72},
  {pos:3,  team:"Bewdley Town",           p:34, w:21, d:5,  l:8,  gd:"+28", pts:68},
  {pos:4,  team:"Stonehouse Town",        p:34, w:19, d:8,  l:7,  gd:"+42", pts:65},
  {pos:5,  team:"Malmesbury Victoria",    p:34, w:17, d:9,  l:8,  gd:"+19", pts:60},
  {pos:6,  team:"Cheltenham Saracens",    p:34, w:17, d:7,  l:10, gd:"+16", pts:58},
  {pos:7,  team:"BTFC",                   p:34, w:15, d:6,  l:13, gd:"+9",  pts:51},
  {pos:8,  team:"Alcester Town",          p:34, w:14, d:6,  l:14, gd:"+10", pts:48},
  {pos:9,  team:"Newent Town",            p:34, w:14, d:4,  l:16, gd:"-4",  pts:46},
  {pos:10, team:"Redditch Borough",       p:34, w:14, d:3,  l:17, gd:"-1",  pts:45},
  {pos:11, team:"Ludlow Town",            p:34, w:11, d:10, l:13, gd:"-14", pts:43},
  {pos:12, team:"Shortwood United",       p:34, w:12, d:6,  l:16, gd:"-3",  pts:42},
  {pos:13, team:"Chipping Sodbury Town",  p:34, w:12, d:6,  l:16, gd:"-8",  pts:42},
  {pos:14, team:"Carterton",              p:34, w:12, d:6,  l:16, gd:"-22", pts:42},
  {pos:15, team:"Woodford United",        p:34, w:9,  d:8,  l:17, gd:"-34", pts:35},
  {pos:16, team:"Clanfield 85",           p:34, w:7,  d:6,  l:21, gd:"-37", pts:27},
  {pos:17, team:"Wellington",             p:34, w:7,  d:3,  l:24, gd:"-52", pts:24},
  {pos:18, team:"Thame United Reserves",  p:34, w:3,  d:5,  l:26, gd:"-52", pts:14}
];

var SQUAD = [
  {name:"Oliver Bradbury",          pos:"GK",  age:0, goals:0,  apps:0,  num:1},
  {name:"Callum Blackford",         pos:"CB",  age:0, goals:0,  apps:0,  num:2},
  {name:"Jacob Chamberlain",        pos:"CB",  age:0, goals:0,  apps:0,  num:3},
  {name:"Xavi Diaz-Butcher",        pos:"CB",  age:0, goals:0,  apps:0,  num:4},
  {name:"Aaron Dainton",            pos:"LB",  age:0, goals:0,  apps:0,  num:5},
  {name:"Ben Hall",                 pos:"RB",  age:0, goals:0,  apps:0,  num:6},
  {name:"Nathan Marks",             pos:"CM",  age:0, goals:0,  apps:0,  num:7},
  {name:"Oliver Martin Gargett",    pos:"CM",  age:0, goals:0,  apps:0,  num:8},
  {name:"Jay Griffiths",            pos:"CM",  age:0, goals:0,  apps:0,  num:9},
  {name:"Matthew Jones",            pos:"CAM", age:0, goals:0,  apps:0,  num:10},
  {name:"Thomas Kenneth Moore",     pos:"CAM", age:0, goals:0,  apps:0,  num:11},
  {name:"Ryan Outram",              pos:"LW",  age:0, goals:0,  apps:0,  num:14},
  {name:"Jonathan Peachey-Score",   pos:"LW",  age:0, goals:0,  apps:67, num:15},
  {name:"James Piatek",             pos:"RW",  age:0, goals:0,  apps:72, num:16},
  {name:"Ben Saunders",             pos:"ST",  age:0, goals:0,  apps:0,  num:17},
  {name:"Lewis Toop",               pos:"ST",  age:0, goals:0,  apps:60, num:9},
  {name:"Jacob Newdick",            pos:"MID", age:0, goals:6,  apps:0,  num:18},
  {name:"Macauley Messenger",       pos:"ST",  age:0, goals:0,  apps:0,  num:19}
];

var RESERVES_SQUAD = [
  {name:"Finley Blythe",       pos:"DEF", age:0, goals:0,  apps:0,  num:1},
  {name:"Fabio Caldarone",     pos:"MID", age:0, goals:0,  apps:0,  num:2},
  {name:"Luke Mitchell",       pos:"DEF", age:0, goals:0,  apps:0,  num:3},
  {name:"Kai Morris",          pos:"MID", age:0, goals:0,  apps:0,  num:4},
  {name:"Thomas Wickens",      pos:"DEF", age:0, goals:0,  apps:0,  num:5},
  {name:"Harry Bunn",          pos:"FWD", age:0, goals:0,  apps:0,  num:6},
  {name:"Liam Dailey",         pos:"MID", age:0, goals:0,  apps:0,  num:7},
  {name:"Charlie Diston",      pos:"DEF", age:0, goals:0,  apps:0,  num:8},
  {name:"Tyler Jesson",        pos:"MID", age:0, goals:0,  apps:0,  num:9},
  {name:"Jake Meredith",       pos:"FWD", age:0, goals:0,  apps:0,  num:10},
  {name:"Matt Prosser",        pos:"MID", age:0, goals:0,  apps:0,  num:11},
  {name:"Ned Ridler-Dutton",   pos:"DEF", age:0, goals:0,  apps:0,  num:12},
  {name:"Tyler Stanton",       pos:"FWD", age:0, goals:0,  apps:0,  num:13},
  {name:"Jamie Shaw",          pos:"MID", age:0, goals:0,  apps:0,  num:14},
  {name:"Lennon Skinner",      pos:"MID", age:0, goals:2,  apps:30, num:15},
  {name:"Luke Bishop",         pos:"GK",  age:0, goals:0,  apps:32, num:16}
];

var RESERVES_FIXTURES = [
  {date:"2026-04-28",home:"BTFC Res",          away:"Cam Bulldogs",       venue:"The Jessons Meadow",           time:"19:00", result:"0-4", type:"Div 2"},
  {date:"2026-04-25",home:"Longlevens 3rds",   away:"BTFC Res",           venue:"Longlevens Ground",    time:"14:30", result:"3-2", type:"Div 2"},
  {date:"2026-04-18",home:"Minety",             away:"BTFC Res",           venue:"Minety Ground",        time:"14:30", result:"8-3", type:"Div 2"},
  {date:"2026-04-14",home:"BTFC Res",           away:"Siddington Athletic",venue:"The Jessons Meadow",           time:"19:00", result:"3-0", type:"Div 2"},
  {date:"2026-04-11",home:"BTFC Res",           away:"Brockworth Albion R",venue:"The Jessons Meadow",           time:"14:30", result:"1-4", type:"Div 2"},
  {date:"2026-04-07",home:"BTFC Res",           away:"Sherston Town",      venue:"The Jessons Meadow",           time:"19:00", result:"1-3", type:"Div 2"},
  {date:"2026-04-01",home:"BTFC Res",           away:"Kingswood",          venue:"The Jessons Meadow",           time:"19:00", result:"2-3", type:"Div 2"},
  {date:"2026-03-14",home:"BTFC Res",           away:"Minety",             venue:"The Jessons Meadow",           time:"14:30", result:"3-3", type:"Div 2"},
  {date:"2026-02-28",home:"BTFC Res",           away:"Sharpness Res",      venue:"The Jessons Meadow",           time:"14:00", result:"1-4", type:"Div 2"},
  {date:"2026-02-14",home:"BTFC Res",           away:"Randwick",           venue:"The Jessons Meadow",           time:"14:00", result:"8-1", type:"Div 2"},
  {date:"2026-01-31",home:"BTFC Res",           away:"Tuffley Rovers 3rds",venue:"The Jessons Meadow",           time:"14:00", result:"2-3", type:"Div 2"},
  {date:"2026-01-10",home:"Sherston Town",      away:"BTFC Res",           venue:"Sherston Ground",      time:"14:00", result:"8-1", type:"L Cup"},
  {date:"2025-12-20",home:"Hardwicke Res",      away:"BTFC Res",           venue:"Hardwicke Ground",     time:"14:00", result:"0-1", type:"Div 2"},
  {date:"2025-12-13",home:"BTFC Res",           away:"Upton St Leonards",  venue:"The Jessons Meadow",           time:"14:00", result:"4-1", type:"Div 2"},
  {date:"2025-12-06",home:"Dursley Town 3rds",  away:"BTFC Res",           venue:"Dursley Ground",       time:"14:00", result:"4-1", type:"Div 2"},
  {date:"2025-11-22",home:"Wotton Rovers",      away:"BTFC Res",           venue:"Wotton Ground",        time:"14:00", result:"H-W", type:"Cup"},
  {date:"2025-11-15",home:"Tuffley Rovers 3rds",away:"BTFC Res",           venue:"Tuffley Ground",       time:"14:00", result:"0-3", type:"Div 2"},
  {date:"2025-11-08",home:"BTFC Res",           away:"Randwick",           venue:"The Jessons Meadow",           time:"14:00", result:"9-0", type:"L Cup"},
  {date:"2025-11-01",home:"Cam Bulldogs",       away:"BTFC Res",           venue:"Cam Ground",           time:"14:00", result:"3-0", type:"Div 2"},
  {date:"2025-10-25",home:"BTFC Res",           away:"Siddington Athletic", venue:"The Jessons Meadow",          time:"14:00", result:"4-1", type:"Cup"},
  {date:"2025-10-18",home:"Kingswood",          away:"BTFC Res",           venue:"Kingswood Ground",     time:"14:30", result:"1-2", type:"Div 2"},
  {date:"2025-10-11",home:"Upton St Leonards",  away:"BTFC Res",           venue:"Upton Ground",         time:"14:30", result:"4-1", type:"Div 2"},
  {date:"2025-10-04",home:"Brockworth Albion R",away:"BTFC Res",           venue:"Brockworth Ground",    time:"14:30", result:"5-2", type:"Div 2"},
  {date:"2025-09-27",home:"Sherston Town",      away:"BTFC Res",           venue:"Sherston Ground",      time:"14:30", result:"3-0", type:"Div 2"},
  {date:"2025-09-20",home:"Sharpness Res",      away:"BTFC Res",           venue:"Sharpness Ground",     time:"14:30", result:"4-2", type:"Div 2"}
];

var RESERVES_LEAGUE = [
  {pos:1,  team:"Cam Bulldogs",          p:26, w:23, d:2, l:1,  gd:"+78", pts:71},
  {pos:2,  team:"Brockworth Albion Res", p:26, w:21, d:2, l:3,  gd:"+77", pts:65},
  {pos:3,  team:"Sherston Town",         p:26, w:20, d:2, l:4,  gd:"+56", pts:62},
  {pos:4,  team:"Longlevens 3rds",       p:26, w:17, d:4, l:5,  gd:"+33", pts:55},
  {pos:5,  team:"Sharpness Res",         p:26, w:16, d:5, l:5,  gd:"+41", pts:53},
  {pos:6,  team:"Minety",               p:26, w:11, d:4, l:11, gd:"+10", pts:37},
  {pos:7,  team:"BTFC Res",             p:26, w:10, d:1, l:15, gd:"-11", pts:31},
  {pos:8,  team:"Hardwicke Res",        p:26, w:9,  d:3, l:14, gd:"-12", pts:30},
  {pos:9,  team:"Upton St Leonards",    p:26, w:9,  d:2, l:15, gd:"-31", pts:29},
  {pos:10, team:"Kingswood",            p:26, w:8,  d:3, l:15, gd:"-22", pts:27},
  {pos:11, team:"Dursley Town 3rds",    p:26, w:8,  d:1, l:17, gd:"-21", pts:25},
  {pos:12, team:"Tuffley Rovers 3rds",  p:26, w:7,  d:2, l:17, gd:"-37", pts:23},
  {pos:13, team:"Siddington Athletic",  p:26, w:6,  d:1, l:19, gd:"-52", pts:19},
  {pos:14, team:"Randwick",             p:26, w:1,  d:0, l:25, gd:"-109",pts:3}
];

var TICKETS = [
  {id:"adult-early",   label:"Adult Early Bird",       price:90, desc:"2026/27 Season &mdash; Early bird price, limited availability", perks:["All home league games","All home cup games","Free matchday programme","Early bird saving &mdash; save &pound;10"], best:true},
  {id:"adult",         label:"Adult",                  price:100,  desc:"2026/27 Season &mdash; All home league and cup games",           perks:["All home league games","All home cup games","Free matchday programme"]},
  {id:"concession-early", label:"Concession Early Bird", price:70, desc:"2026/27 Season &mdash; 65+ / Students with valid ID. Early bird price", perks:["All home league games","All home cup games","Free matchday programme","Early bird saving &mdash; save &pound;10"], best:true},
  {id:"concession",    label:"Concession",             price:80,  desc:"2026/27 Season &mdash; 65+ / Students with valid ID",           perks:["All home league games","All home cup games","Free matchday programme"]}
];

var POS_COLORS = {GK:"#1e3a5f",CB:"#1149D8",LB:"#3F4DA1",RB:"#3F4DA1",CM:"#041B5F",CAM:"#2563FF",LW:"#1149D8",RW:"#1149D8",ST:"#7f1d1d"};

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-GB", {weekday:"short",day:"numeric",month:"short"});
}
function isPast(d) { return new Date(d) < new Date(); }

function showPage(id) {
  document.querySelectorAll(".page").forEach(function(p) { p.classList.remove("active"); });
  document.querySelectorAll(".nav-link").forEach(function(l) { l.classList.remove("active"); });
  var pg = document.getElementById("page-" + id);
  if (pg) pg.classList.add("active");
  document.querySelectorAll(".nav-link").forEach(function(b) {
    var oc = b.getAttribute("onclick") || "";
    if (oc.indexOf(id) !== -1) b.classList.add("active");
  });
  window.scrollTo({top:0,behavior:"smooth"});
  if (id === "fixtures" || id === "home") renderFixtures(null);
  if (id === "shop") {} // shop is static
  if (id === "teams") renderSquad("All");
  if (id === "home") renderLeague();
  if (id === "tickets") renderTickets();
}

function resultColor(result, isHome) {
  if (!result) return "#1149D8";
  var parts = result.split("-");
  var h = parseInt(parts[0]), a = parseInt(parts[1]);
  var s = isHome ? h : a, c = isHome ? a : h;
  return s > c ? "#22C55E" : s === c ? "#F59E0B" : "#EF4444";
}

// Jessons Real Estate - Ground Sponsor
var JESSONS_LOGO = "/jessons-logo.png";

// Opponent badge URLs — FA Full-Time / Flashscore badge CDN
// Using a generic football badge SVG as fallback for any team not listed
var OPP_BADGES = {
  "FC Stratford":         "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/ew8qxmv7xlefgfpimgge",
  "Wantage Town":         "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/wantage",
  "Bewdley Town":         "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/bewdley",
  "Stonehouse Town":      "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/stonehouse",
  "Malmesbury Victoria":  "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/malmesbury",
  "Cheltenham Saracens":  "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/cheltenham-saracens",
  "Alcester Town":        "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/alcester",
  "Newent Town":          "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/newent",
  "Redditch Borough":     "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/redditch-borough",
  "Ludlow Town":          "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/ludlow",
  "Shortwood United":     "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/shortwood",
  "Chipping Sodbury Town":"https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/chipping-sodbury",
  "Chipping Sodbury":     "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/chipping-sodbury",
  "Carterton":            "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/carterton",
  "Woodford United":      "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/woodford",
  "Clanfield 85":         "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/clanfield",
  "Wellington":           "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/wellington",
  "Thame United Reserves":"https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/thame",
  "Thame Utd Res":        "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/thame",
  "Highworth Town":       "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/highworth",
  "Malmesbury Vic":       "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/malmesbury",
  "Cheltenham Sar":       "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/cheltenham-saracens"
};

// Generic football badge SVG used as fallback when no badge URL is found
var GENERIC_BADGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23E5E7EB'/%3E%3Ccircle cx='20' cy='20' r='14' fill='%231149D8' opacity='0.15'/%3E%3Ctext x='20' y='25' text-anchor='middle' font-family='Barlow Condensed,sans-serif' font-size='11' fill='%236B7280'%3EFC%3C/text%3E%3C/svg%3E";

function getOppBadge(name) {
  return OPP_BADGES[name] || GENERIC_BADGE;
}

function fixtureHTML(f) {
  var isHome = f.home === "BTFC";
  var rc = resultColor(f.result, isHome);
  var rowClass = "fixture-row";
  var scoreClass = "fixture-score";
  if (f.result) {
    var parts = f.result.split("-");
    var h = parseInt(parts[0]), a = parseInt(parts[1]);
    var s = isHome ? h : a, c = isHome ? a : h;
    if (s > c)      { rowClass += " win";  scoreClass += " win"; }
    else if (s < c) { rowClass += " loss"; scoreClass += " loss"; }
    else            { rowClass += " draw"; scoreClass += " draw"; }
  } else {
    rowClass += " upcoming";
  }
  var scoreHTML = f.result
    ? "<span class=\\"" + scoreClass + "\\">" + f.result + "</span>"
    : "<span class=\\"fixture-vs\\">VS</span>";
  var typeColor = f.type === "GFA Trophy" ? "#166534" : f.type === "Cup" ? "#92400E" : f.type === "FA Cup" ? "#7f1d1d" : f.type === "FA Vase" ? "#7f1d1d" : f.type === "Floodlit Cup" ? "#374151" : "#1149D8";
  var btfcBadge = "<img src=\\"" + LOGO_URL + "\\" alt=\\"BTFC\\">";
  var oppName  = f.home === "BTFC" ? f.away : f.home;
  var oppSrc   = getOppBadge(oppName);
  var oppBadge = "<img src=\\"" + oppSrc + "\\" alt=\\"" + oppName + "\\" onerror=\\"this.src=&quot;" + GENERIC_BADGE + "&quot;\\">";
  var homeHTML = f.home === "BTFC"
    ? "<span class=\\"fixture-team btfc\\">" + btfcBadge + "BTFC</span>"
    : "<span class=\\"fixture-team opp\\">" + oppBadge + f.home + "</span>";
  var awayHTML = f.away === "BTFC"
    ? "<span class=\\"fixture-team btfc\\">" + btfcBadge + "BTFC</span>"
    : "<span class=\\"fixture-team opp\\">" + oppBadge + f.away + "</span>";
  return "<div class=\\"" + rowClass + "\\">" +
    "<div class=\\"fixture-date\\"><div class=\\"fixture-date-main\\">" + fmtDate(f.date) + "</div><div class=\\"fixture-date-sub\\">" + f.time + "</div></div>" +
    "<span class=\\"pill\\" style=\\"background:" + typeColor + ";font-size:9px;flex-shrink:0\\">" + f.type + "</span>" +
    "<div class=\\"fixture-teams\\">" + homeHTML + scoreHTML + awayHTML + "</div>" +
    "<div class=\\"fixture-venue\\">&#128205; " + f.venue + "</div>" +
  "</div>";
}

function renderFixtures(filter) {
  var sorted = FIXTURES.slice().sort(function(a,b) { return new Date(b.date) - new Date(a.date); });
  var shown = sorted;
  if (filter === "Upcoming") shown = sorted.filter(function(f) { return !isPast(f.date); });
  if (filter === "Results")  shown = sorted.filter(function(f) { return isPast(f.date); });
  var html = shown.map(fixtureHTML).join("");
  var fl = document.getElementById("fixtures-list");
  if (fl) fl.innerHTML = html;
  var hf = document.getElementById("home-fixtures");
  if (hf) hf.innerHTML = shown.slice(0,4).map(fixtureHTML).join("");
}

function filterFixtures(filter, btn) {
  document.querySelectorAll(".filter-btn").forEach(function(b) { b.classList.remove("active"); });
  btn.classList.add("active");
  renderFixtures(filter);
}

function renderLeague() {
  var html = LEAGUE.map(function(r) {
    var isBTFC = r.team === "BTFC";
    var logoHTML = isBTFC ? "<img src=\\"" + LOGO_URL + "\\" alt=\\"BTFC\\">" : "";
    return "<div class=\\"table-row" + (isBTFC ? " btfc" : "") + "\\">" +
      "<div class=\\"table-pos" + (isBTFC ? " btfc" : "") + "\\">" + r.pos + "</div>" +
      "<div class=\\"table-club" + (isBTFC ? " btfc" : "") + "\\">" + logoHTML + "<span>" + r.team + "</span></div>" +
      "<div class=\\"table-stat\\">" + r.p + "</div>" +
      "<div class=\\"table-stat\\">" + r.w + "</div>" +
      "<div class=\\"table-stat\\">" + r.d + "</div>" +
      "<div class=\\"table-stat\\">" + r.l + "</div>" +
      "<div class=\\"table-stat\\">" + r.gd + "</div>" +
      "<div class=\\"table-pts\\">" + r.pts + "</div>" +
    "</div>";
  }).join("");
  var el = document.getElementById("league-table");
  if (el) el.innerHTML = html;
}

function renderSquad(filter) {
  var shown = filter === "All" ? SQUAD : SQUAD.filter(function(p) { return p.pos === filter; });
  var el = document.getElementById("squad-grid");
  if (!el) return;
  el.innerHTML = "";
  shown.forEach(function(p) {
    var col = POS_COLORS[p.pos] || "#1149D8";
    var num = p.num < 10 ? "0" + p.num : "" + p.num;
    var div = document.createElement("div");
    div.className = "player-card";
    div.dataset.goals = p.goals;
    div.dataset.apps = p.apps;
    div.innerHTML =
      "<div class=\\"player-bar\\" style=\\"background:" + col + "\\"></div>" +
      "<div class=\\"player-body\\">" +
        "<div class=\\"player-num\\">" + num + "</div>" +
        "<span class=\\"pill\\" style=\\"background:" + col + "\\">" + p.pos + "</span>" +
        "<div class=\\"player-name\\">" + p.name + "</div>" +
        "<div class=\\"player-age\\">Age " + p.age + "</div>" +
      "</div>";
    div.addEventListener("click", function() { togglePlayer(div); });
    el.appendChild(div);
  });
}

function togglePlayer(el) {
  var wasSelected = el.classList.contains("selected");
  document.querySelectorAll(".player-card").forEach(function(c) {
    c.classList.remove("selected");
    var s = c.querySelector(".player-stats");
    if (s) s.remove();
  });
  if (!wasSelected) {
    el.classList.add("selected");
    var stats = document.createElement("div");
    stats.className = "player-stats";
    stats.innerHTML =
      "<div><div class=\\"pstat-val\\" style=\\"color:#1149D8\\">" + el.dataset.goals + "</div><div class=\\"pstat-label\\">GOALS</div></div>" +
      "<div><div class=\\"pstat-val\\" style=\\"color:#2563FF\\">" + el.dataset.apps + "</div><div class=\\"pstat-label\\">APPS</div></div>";
    el.querySelector(".player-body").appendChild(stats);
  }
}

function filterSquad(pos, btn) {
  document.querySelectorAll(".pos-btn").forEach(function(b) { b.classList.remove("active"); });
  btn.classList.add("active");
  renderSquad(pos);
}

function renderTickets() {
  var el = document.getElementById("ticket-grid");
  if (!el) return;
  el.innerHTML = "";
  TICKETS.forEach(function(t) {
    var div = document.createElement("div");
    div.className = "ticket-card";
    div.id = "ticket-" + t.id;
    var perksHTML = t.perks.map(function(p) {
      return "<li class=\\"tcard-perk\\"><span class=\\"tcard-check\\">&#10003;</span>" + p + "</li>";
    }).join("");
    var bestHTML = t.best ? "<div style=\\"position:absolute;top:12px;right:12px\\"><span class=\\"pill\\" style=\\"background:#166534\\">Best Value</span></div>" : "";
    div.innerHTML =
      bestHTML +
      "<div class=\\"tcard-bar\\"></div>" +
      "<div class=\\"tcard-label\\">" + t.label + "</div>" +
      "<div class=\\"tcard-price\\">&pound;" + t.price + "</div>" +
      "<div class=\\"tcard-desc\\">" + t.desc + "</div>" +
      "<ul class=\\"tcard-perks\\">" + perksHTML + "</ul>" +
      "<button class=\\"tcard-btn\\">Select</button>";
    div.addEventListener("click", function() { selectTicket(t.id); });
    el.appendChild(div);
  });
}

function selectTicket(id) {
  var t = null;
  for (var i = 0; i < TICKETS.length; i++) { if (TICKETS[i].id === id) { t = TICKETS[i]; break; } }
  if (!t) return;
  document.querySelectorAll(".ticket-card").forEach(function(c) { c.classList.remove("selected"); });
  var card = document.getElementById("ticket-" + id);
  if (card) card.classList.add("selected");
  var box = document.getElementById("checkout-box");
  box.style.display = "block";

  var perksHTML = t.perks.map(function(p) {
    return "<li class=\\"tcard-perk\\"><span class=\\"tcard-check\\">&#10003;</span>" + p + "</li>";
  }).join("");

  var inner = document.createElement("div");
  inner.className = "checkout-box";
  inner.innerHTML =
    "<div style=\\"font-family:Barlow Condensed,sans-serif;font-size:26px;color:#2D2D2D;letter-spacing:.04em;margin-bottom:4px\\">Order Summary</div>" +
    "<div style=\\"font-size:13px;color:#6B7280;margin-bottom:24px\\">Complete your details then proceed to our secure Zettle payment page.</div>" +
    "<div style=\\"background:#F2F2F2;border-radius:6px;padding:16px 18px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center\\">" +
      "<div><div style=\\"font-family:Barlow Condensed,sans-serif;font-size:20px;color:#2D2D2D\\">" + t.label + " Season Ticket</div><div style=\\"font-size:12px;color:#6B7280\\">" + t.desc + "</div></div>" +
      "<div style=\\"font-family:Barlow Condensed,sans-serif;font-size:28px;color:#1149D8\\">&pound;" + t.price + "</div>" +
    "</div>" +
    "<label class=\\"form-label\\">Full Name <span style=\\"color:#EF4444\\">*</span></label><input class=\\"form-input\\" id=\\"t-name\\" placeholder=\\"John Smith\\" oninput=\\"this.style.borderColor='#E5E7EB'\\">" +
    "<label class=\\"form-label\\">Email Address <span style=\\"color:#EF4444\\">*</span></label><input class=\\"form-input\\" id=\\"t-email\\" type=\\"email\\" placeholder=\\"john@example.com\\" oninput=\\"this.style.borderColor='#E5E7EB'\\">" +
    "<label class=\\"form-label\\">Phone Number <span style=\\"color:#EF4444\\">*</span></label><input class=\\"form-input\\" id=\\"t-phone\\" type=\\"tel\\" placeholder=\\"07700 900000\\" oninput=\\"this.style.borderColor='#E5E7EB'\\">" +
    "<div id=\\"t-error\\" style=\\"display:none;background:#FEF2F2;border:1px solid #EF4444;border-radius:6px;padding:10px 14px;margin-bottom:16px;font-size:12px;color:#DC2626;font-weight:600\\"></div>" +
    "<div style=\\"background:rgba(17,73,216,.06);border:1px solid rgba(17,73,216,.2);border-radius:6px;padding:12px 16px;margin-bottom:24px;display:flex;gap:10px\\">" +
      "<span style=\\"font-size:18px;flex-shrink:0\\">&#128274;</span>" +
      "<p style=\\"font-size:12px;color:#374151;line-height:1.55;margin:0\\"><strong>Secure payment via Zettle.</strong> Opens a new tab to pay safely by card. After payment you will receive a confirmation email with your season ticket &mdash; show it on your phone at the gate or <strong>print it at home</strong>. Both work fine.</p>" +
    "</div>";

  var payBtn = document.createElement("button");
  payBtn.style.cssText = "width:100%;background:#1149D8;color:#fff;border:none;padding:16px;border-radius:6px;font-family:Montserrat,sans-serif;font-weight:800;font-size:14px;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;margin-bottom:12px";
  payBtn.textContent = "Continue to Payment";
  payBtn.addEventListener("click", function() {
    var nameVal  = document.getElementById("t-name")  ? document.getElementById("t-name").value.trim()  : "";
    var emailVal = document.getElementById("t-email") ? document.getElementById("t-email").value.trim() : "";
    var phoneVal = document.getElementById("t-phone") ? document.getElementById("t-phone").value.trim() : "";
    var errorEl  = document.getElementById("t-error");

    // Clear previous error
    if (errorEl) errorEl.style.display = "none";

    // Validate
    if (!nameVal) {
      document.getElementById("t-name").style.borderColor = "#EF4444";
      document.getElementById("t-name").focus();
      if (errorEl) { errorEl.textContent = "Please enter your full name."; errorEl.style.display = "block"; }
      return;
    }
    if (!emailVal || !emailVal.includes("@")) {
      document.getElementById("t-email").style.borderColor = "#EF4444";
      document.getElementById("t-email").focus();
      if (errorEl) { errorEl.textContent = "Please enter a valid email address."; errorEl.style.display = "block"; }
      return;
    }
    if (!phoneVal) {
      document.getElementById("t-phone").style.borderColor = "#EF4444";
      document.getElementById("t-phone").focus();
      if (errorEl) { errorEl.textContent = "Please enter your phone number."; errorEl.style.display = "block"; }
      return;
    }

    // All good — reset borders and proceed to Zettle
    document.getElementById("t-name").style.borderColor  = "#22C55E";
    document.getElementById("t-email").style.borderColor = "#22C55E";
    document.getElementById("t-phone").style.borderColor = "#22C55E";
    window.open(ZETTLE, "_blank");
  });
  inner.appendChild(payBtn);

  var changeBtn = document.createElement("div");
  changeBtn.style.cssText = "text-align:center";
  changeBtn.innerHTML = "<button style=\\"background:none;border:none;color:#9CA3AF;font-size:12px;cursor:pointer;text-decoration:underline\\" id=\\"change-ticket-btn\\">Change ticket type</button>";
  inner.appendChild(changeBtn);

  box.innerHTML = "";
  box.appendChild(inner);

  document.getElementById("change-ticket-btn").addEventListener("click", function() {
    box.style.display = "none";
    document.querySelectorAll(".ticket-card").forEach(function(c) { c.classList.remove("selected"); });
  });

  box.scrollIntoView({behavior:"smooth",block:"start"});
}

function sendMsg() {
  var wrap = document.getElementById("contact-form-wrap");
  if (wrap) {
    wrap.innerHTML =
      "<div style=\\"text-align:center;padding:60px 40px;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);border-radius:8px\\">" +
      "<div style=\\"font-family:Barlow Condensed,sans-serif;font-size:52px;color:#22C55E;margin-bottom:8px\\">&#10003;</div>" +
      "<h3 style=\\"font-family:Barlow Condensed,sans-serif;font-size:30px;color:#22C55E;letter-spacing:.04em\\">Message Sent!</h3>" +
      "<p style=\\"color:rgba(255,255,255,.5);font-size:14px\\">We will get back to you within 48 hours.</p></div>";
  }
}

function showTeam(id, btn) {
  document.querySelectorAll("#team-first,#team-reserves,#team-u17").forEach(function(el) { el.style.display = "none"; });
  document.querySelectorAll("#tab-first,#tab-reserves,#tab-u17").forEach(function(b) {
    b.style.background = "transparent";
    b.style.color = "#1149D8";
  });
  document.getElementById("team-" + id).style.display = "block";
  if (btn) { btn.style.background = "#1149D8"; btn.style.color = "#fff"; }
  if (id === "reserves") { renderReservesSquad(); renderReservesFixtures(null); renderReservesLeague(); }
}

function reserveFixtureHTML(f) {
  var isBTFC = f.home === "BTFC Res";
  var rc = resultColor(f.result === "H-W" ? null : f.result, isBTFC);
  if (f.result === "H-W") rc = "#F59E0B";
  var scoreHTML = f.result
    ? "<span class=\\"fixture-score\\" style=\\"color:" + rc + "\\">" + f.result + "</span>"
    : "<span class=\\"fixture-vs\\">VS</span>";
  var typeColor = f.type === "L Cup" || f.type === "Cup" ? "#92400E" : f.type === "CC" || f.type === "Cup (North)" ? "#166534" : "#1149D8";
  var btfcBadge = "<img src=\\"" + LOGO_URL + "\\" alt=\\"BTFC\\" style=\\"width:22px;height:22px;border-radius:50%;background:#fff;border:1.5px solid #1149D8;vertical-align:middle\\">";
  var homeHTML = f.home === "BTFC Res"
    ? "<span class=\\"fixture-team btfc\\" style=\\"font-size:18px\\">" + btfcBadge + "&nbsp;BTFC Res</span>"
    : "<span class=\\"fixture-team opp\\">" + f.home + "</span>";
  var awayHTML = f.away === "BTFC Res"
    ? "<span class=\\"fixture-team btfc\\" style=\\"font-size:18px\\">" + btfcBadge + "&nbsp;BTFC Res</span>"
    : "<span class=\\"fixture-team opp\\">" + f.away + "</span>";
  return "<div class=\\"fixture-row\\" style=\\"border-left-color:" + rc + "\\">" +
    "<div class=\\"fixture-date\\"><div class=\\"fixture-date-main\\">" + fmtDate(f.date) + "</div><div class=\\"fixture-date-sub\\">" + f.time + "</div></div>" +
    "<span class=\\"pill\\" style=\\"background:" + typeColor + ";font-size:9px\\">" + f.type + "</span>" +
    "<div class=\\"fixture-teams\\">" + homeHTML + scoreHTML + awayHTML + "</div>" +
    "<div class=\\"fixture-venue\\">&#128205; " + f.venue + "</div>" +
  "</div>";
}

function renderReservesFixtures(filter) {
  var sorted = RESERVES_FIXTURES.slice().sort(function(a,b) { return new Date(b.date) - new Date(a.date); });
  var shown = sorted;
  if (filter === "Upcoming") shown = sorted.filter(function(f) { return !isPast(f.date); });
  if (filter === "Results")  shown = sorted.filter(function(f) { return isPast(f.date); });
  var el = document.getElementById("reserves-fixtures-list");
  if (el) el.innerHTML = shown.map(reserveFixtureHTML).join("");
}

function filterReserves(filter, btn) {
  document.querySelectorAll(".filter-btn").forEach(function(b) { b.classList.remove("active"); });
  btn.classList.add("active");
  renderReservesFixtures(filter);
}

function renderReservesLeague() {
  var el = document.getElementById("reserves-league-table");
  if (!el) return;
  el.innerHTML = RESERVES_LEAGUE.map(function(r) {
    var isBTFC = r.team === "BTFC Res";
    var logoHTML = isBTFC ? "<img src=\\"" + LOGO_URL + "\\" alt=\\"BTFC\\" style=\\"width:18px;height:18px;border-radius:50%;background:#fff;margin-right:4px\\">" : "";
    return "<div class=\\"table-row" + (isBTFC ? " btfc" : "") + "\\">" +
      "<div class=\\"table-pos" + (isBTFC ? " btfc" : "") + "\\">" + r.pos + "</div>" +
      "<div class=\\"table-club" + (isBTFC ? " btfc" : "") + "\\">" + logoHTML + "<span>" + r.team + "</span></div>" +
      "<div class=\\"table-stat\\">" + r.p + "</div>" +
      "<div class=\\"table-stat\\">" + r.w + "</div>" +
      "<div class=\\"table-stat\\">" + r.d + "</div>" +
      "<div class=\\"table-stat\\">" + r.l + "</div>" +
      "<div class=\\"table-stat\\">" + r.gd + "</div>" +
      "<div class=\\"table-pts\\">" + r.pts + "</div>" +
    "</div>";
  }).join("");
}

function renderReservesSquad() {
  var el = document.getElementById("reserves-grid");
  if (!el) return;
  el.innerHTML = "";
  RESERVES_SQUAD.forEach(function(p) {
    var col = "#3F4DA1";
    var num = p.num < 10 ? "0" + p.num : "" + p.num;
    var div = document.createElement("div");
    div.className = "player-card";
    div.dataset.goals = p.goals;
    div.dataset.apps = p.apps;
    div.innerHTML =
      "<div class=\\"player-bar\\" style=\\"background:" + col + "\\"></div>" +
      "<div class=\\"player-body\\">" +
        "<div class=\\"player-num\\">" + num + "</div>" +
        "<span class=\\"pill\\" style=\\"background:" + col + "\\">" + p.pos + "</span>" +
        "<div class=\\"player-name\\">" + p.name + "</div>" +
      "</div>";
    div.addEventListener("click", function() { togglePlayer(div); });
    el.appendChild(div);
  });
}

renderFixtures(null);
renderLeague();
renderSquad("All");
renderTickets();

// Set logo images
var logoImgs = document.querySelectorAll("#first-logo,#reserves-logo,#u17-logo");
logoImgs.forEach(function(img) { img.src = LOGO_URL; });
</script>`}} />
      <script dangerouslySetInnerHTML={{__html:`
var LOGO_URL = "/crest.png";
var GEL_URL = "/gel-logo.png";
var ZETTLE   = "https://pay.izettle.com/?gpy9xFwrb";

var FIXTURES = [
  {date:"2026-04-18",home:"BTFC",               away:"FC Stratford",          venue:"The Jessons Meadow",                  time:"15:00", result:"1-2",  type:"League"},
  {date:"2026-04-14",home:"Thame Utd Res",      away:"BTFC",                  venue:"Thame United Ground",         time:"19:45", result:"0-2",  type:"League"},
  {date:"2026-04-11",home:"Ludlow Town",        away:"BTFC",                  venue:"Ludlow Ground",               time:"15:00", result:"1-1",  type:"League"},
  {date:"2026-04-09",home:"Malmesbury Vic",     away:"BTFC",                  venue:"Malmesbury Ground",           time:"19:45", result:"3-0",  type:"League"},
  {date:"2026-04-04",home:"BTFC",               away:"Wellington",            venue:"The Jessons Meadow",                  time:"15:00", result:"5-1",  type:"League"},
  {date:"2026-03-28",home:"Redditch Borough",   away:"BTFC",                  venue:"Redditch Ground",             time:"15:00", result:"0-3",  type:"League"},
  {date:"2026-03-24",home:"Clanfield 85",       away:"BTFC",                  venue:"Clanfield Ground",            time:"19:45", result:"0-4",  type:"League"},
  {date:"2026-03-21",home:"BTFC",               away:"Woodford United",       venue:"The Jessons Meadow",                  time:"15:00", result:"4-1",  type:"League"},
  {date:"2026-03-17",home:"Woodford United",    away:"BTFC",                  venue:"Woodford Ground",             time:"19:45", result:"0-2",  type:"League"},
  {date:"2026-03-07",home:"BTFC",               away:"Bewdley Town",          venue:"The Jessons Meadow",                  time:"15:00", result:"0-3",  type:"League"},
  {date:"2026-02-21",home:"BTFC",               away:"Redditch Borough",      venue:"The Jessons Meadow",                  time:"15:00", result:"0-0",  type:"League"},
  {date:"2026-02-14",home:"Wantage Town",       away:"BTFC",                  venue:"Wantage Ground",              time:"15:00", result:"2-1",  type:"League"},
  {date:"2026-02-10",home:"BTFC",               away:"Carterton",             venue:"The Jessons Meadow",                  time:"19:45", result:"6-1",  type:"League"},
  {date:"2026-01-24",home:"BTFC",               away:"Cheltenham Saracens",   venue:"The Jessons Meadow",                  time:"15:00", result:"1-0",  type:"League"},
  {date:"2026-01-10",home:"Wellington",         away:"BTFC",                  venue:"Wellington Ground",           time:"15:00", result:"3-2",  type:"League"},
  {date:"2026-01-02",home:"BTFC",               away:"Stonehouse Town",       venue:"The Jessons Meadow",                  time:"19:45", result:"1-1",  type:"League"},
  {date:"2025-12-27",home:"Shortwood United",   away:"BTFC",                  venue:"Shortwood Ground",            time:"15:00", result:"3-0",  type:"League"},
  {date:"2025-12-13",home:"Bewdley Town",       away:"BTFC",                  venue:"Bewdley Ground",              time:"15:00", result:"1-0",  type:"League"},
  {date:"2025-12-06",home:"BTFC",               away:"Newent Town",           venue:"The Jessons Meadow",                  time:"15:00", result:"2-1",  type:"League"},
  {date:"2025-11-22",home:"BTFC",               away:"Clanfield 85",          venue:"The Jessons Meadow",                  time:"15:00", result:"2-2",  type:"League"},
  {date:"2025-11-15",home:"Alcester Town",      away:"BTFC",                  venue:"Alcester Ground",             time:"15:00", result:"4-3",  type:"League"},
  {date:"2025-11-08",home:"Cheltenham Saracens",away:"BTFC",                  venue:"Cheltenham Saracens Ground",  time:"15:00", result:"2-2",  type:"League"},
  {date:"2025-11-04",home:"Shortwood United",   away:"BTFC",                  venue:"Shortwood Ground",            time:"19:45", result:"3-0",  type:"GFA Trophy"},
  {date:"2025-11-01",home:"BTFC",               away:"Highworth Town",        venue:"The Jessons Meadow",                  time:"15:00", result:"1-2",  type:"Cup"},
  {date:"2025-10-18",home:"Chipping Sodbury Town",away:"BTFC",                venue:"Chipping Sodbury Ground",     time:"15:00", result:"2-1",  type:"League"},
  {date:"2025-10-14",home:"BTFC",               away:"Chipping Sodbury Town", venue:"The Jessons Meadow",                  time:"19:45", result:"1-4",  type:"Floodlit Cup"},
  {date:"2025-10-11",home:"BTFC",               away:"Kidlington FC Dev",     venue:"The Jessons Meadow",                  time:"15:00", result:"10-0", type:"Cup"},
  {date:"2025-10-04",home:"BTFC",               away:"Thame United Reserves", venue:"The Jessons Meadow",                  time:"15:00", result:"2-1",  type:"League"},
  {date:"2025-09-27",home:"BTFC",               away:"Shortwood United",      venue:"The Jessons Meadow",                  time:"15:00", result:"1-1",  type:"Cup"},
  {date:"2025-09-20",home:"BTFC",               away:"Ludlow Town",           venue:"The Jessons Meadow",                  time:"15:00", result:"1-2",  type:"League"},
  {date:"2025-09-13",home:"BTFC",               away:"Malmesbury Victoria",   venue:"The Jessons Meadow",                  time:"15:00", result:"0-0",  type:"League"},
  {date:"2025-09-06",home:"Carterton",          away:"BTFC",                  venue:"Carterton Ground",            time:"15:00", result:"0-2",  type:"League"},
  {date:"2025-08-30",home:"BTFC",               away:"Alcester Town",         venue:"The Jessons Meadow",                  time:"15:00", result:"1-0",  type:"League"},
  {date:"2025-08-25",home:"FC Stratford",       away:"BTFC",                  venue:"FC Stratford Ground",         time:"15:00", result:"3-4",  type:"League"},
  {date:"2025-08-23",home:"Avonmouth",          away:"BTFC",                  venue:"Avonmouth Ground",            time:"15:00", result:"3-0",  type:"FA Vase"},
  {date:"2025-08-16",home:"BTFC",               away:"Shortwood United",      venue:"The Jessons Meadow",                  time:"15:00", result:"0-3",  type:"League"},
  {date:"2025-08-12",home:"Newent Town",        away:"BTFC",                  venue:"Newent Ground",               time:"19:45", result:"2-0",  type:"League"},
  {date:"2025-08-09",home:"Stonehouse Town",    away:"BTFC",                  venue:"Stonehouse Ground",           time:"15:00", result:"3-0",  type:"League"},
  {date:"2025-08-05",home:"BTFC",               away:"Chipping Sodbury Town", venue:"The Jessons Meadow",                  time:"19:45", result:"3-2",  type:"League"},
  {date:"2025-08-02",home:"BTFC",               away:"Wantage Town",          venue:"The Jessons Meadow",                  time:"15:00", result:"3-1",  type:"League"}
];

var LEAGUE = [
  {pos:1,  team:"FC Stratford",          p:34, w:26, d:3,  l:5,  gd:"+52", pts:81},
  {pos:2,  team:"Wantage Town",           p:34, w:21, d:9,  l:4,  gd:"+51", pts:72},
  {pos:3,  team:"Bewdley Town",           p:34, w:21, d:5,  l:8,  gd:"+28", pts:68},
  {pos:4,  team:"Stonehouse Town",        p:34, w:19, d:8,  l:7,  gd:"+42", pts:65},
  {pos:5,  team:"Malmesbury Victoria",    p:34, w:17, d:9,  l:8,  gd:"+19", pts:60},
  {pos:6,  team:"Cheltenham Saracens",    p:34, w:17, d:7,  l:10, gd:"+16", pts:58},
  {pos:7,  team:"BTFC",                   p:34, w:15, d:6,  l:13, gd:"+9",  pts:51},
  {pos:8,  team:"Alcester Town",          p:34, w:14, d:6,  l:14, gd:"+10", pts:48},
  {pos:9,  team:"Newent Town",            p:34, w:14, d:4,  l:16, gd:"-4",  pts:46},
  {pos:10, team:"Redditch Borough",       p:34, w:14, d:3,  l:17, gd:"-1",  pts:45},
  {pos:11, team:"Ludlow Town",            p:34, w:11, d:10, l:13, gd:"-14", pts:43},
  {pos:12, team:"Shortwood United",       p:34, w:12, d:6,  l:16, gd:"-3",  pts:42},
  {pos:13, team:"Chipping Sodbury Town",  p:34, w:12, d:6,  l:16, gd:"-8",  pts:42},
  {pos:14, team:"Carterton",              p:34, w:12, d:6,  l:16, gd:"-22", pts:42},
  {pos:15, team:"Woodford United",        p:34, w:9,  d:8,  l:17, gd:"-34", pts:35},
  {pos:16, team:"Clanfield 85",           p:34, w:7,  d:6,  l:21, gd:"-37", pts:27},
  {pos:17, team:"Wellington",             p:34, w:7,  d:3,  l:24, gd:"-52", pts:24},
  {pos:18, team:"Thame United Reserves",  p:34, w:3,  d:5,  l:26, gd:"-52", pts:14}
];

var SQUAD = [
  {name:"Oliver Bradbury",          pos:"GK",  age:0, goals:0,  apps:0,  num:1},
  {name:"Callum Blackford",         pos:"CB",  age:0, goals:0,  apps:0,  num:2},
  {name:"Jacob Chamberlain",        pos:"CB",  age:0, goals:0,  apps:0,  num:3},
  {name:"Xavi Diaz-Butcher",        pos:"CB",  age:0, goals:0,  apps:0,  num:4},
  {name:"Aaron Dainton",            pos:"LB",  age:0, goals:0,  apps:0,  num:5},
  {name:"Ben Hall",                 pos:"RB",  age:0, goals:0,  apps:0,  num:6},
  {name:"Nathan Marks",             pos:"CM",  age:0, goals:0,  apps:0,  num:7},
  {name:"Oliver Martin Gargett",    pos:"CM",  age:0, goals:0,  apps:0,  num:8},
  {name:"Jay Griffiths",            pos:"CM",  age:0, goals:0,  apps:0,  num:9},
  {name:"Matthew Jones",            pos:"CAM", age:0, goals:0,  apps:0,  num:10},
  {name:"Thomas Kenneth Moore",     pos:"CAM", age:0, goals:0,  apps:0,  num:11},
  {name:"Ryan Outram",              pos:"LW",  age:0, goals:0,  apps:0,  num:14},
  {name:"Jonathan Peachey-Score",   pos:"LW",  age:0, goals:0,  apps:67, num:15},
  {name:"James Piatek",             pos:"RW",  age:0, goals:0,  apps:72, num:16},
  {name:"Ben Saunders",             pos:"ST",  age:0, goals:0,  apps:0,  num:17},
  {name:"Lewis Toop",               pos:"ST",  age:0, goals:0,  apps:60, num:9},
  {name:"Jacob Newdick",            pos:"MID", age:0, goals:6,  apps:0,  num:18},
  {name:"Macauley Messenger",       pos:"ST",  age:0, goals:0,  apps:0,  num:19}
];

var RESERVES_SQUAD = [
  {name:"Finley Blythe",       pos:"DEF", age:0, goals:0,  apps:0,  num:1},
  {name:"Fabio Caldarone",     pos:"MID", age:0, goals:0,  apps:0,  num:2},
  {name:"Luke Mitchell",       pos:"DEF", age:0, goals:0,  apps:0,  num:3},
  {name:"Kai Morris",          pos:"MID", age:0, goals:0,  apps:0,  num:4},
  {name:"Thomas Wickens",      pos:"DEF", age:0, goals:0,  apps:0,  num:5},
  {name:"Harry Bunn",          pos:"FWD", age:0, goals:0,  apps:0,  num:6},
  {name:"Liam Dailey",         pos:"MID", age:0, goals:0,  apps:0,  num:7},
  {name:"Charlie Diston",      pos:"DEF", age:0, goals:0,  apps:0,  num:8},
  {name:"Tyler Jesson",        pos:"MID", age:0, goals:0,  apps:0,  num:9},
  {name:"Jake Meredith",       pos:"FWD", age:0, goals:0,  apps:0,  num:10},
  {name:"Matt Prosser",        pos:"MID", age:0, goals:0,  apps:0,  num:11},
  {name:"Ned Ridler-Dutton",   pos:"DEF", age:0, goals:0,  apps:0,  num:12},
  {name:"Tyler Stanton",       pos:"FWD", age:0, goals:0,  apps:0,  num:13},
  {name:"Jamie Shaw",          pos:"MID", age:0, goals:0,  apps:0,  num:14},
  {name:"Lennon Skinner",      pos:"MID", age:0, goals:2,  apps:30, num:15},
  {name:"Luke Bishop",         pos:"GK",  age:0, goals:0,  apps:32, num:16}
];

var RESERVES_FIXTURES = [
  {date:"2026-04-28",home:"BTFC Res",          away:"Cam Bulldogs",       venue:"The Jessons Meadow",           time:"19:00", result:"0-4", type:"Div 2"},
  {date:"2026-04-25",home:"Longlevens 3rds",   away:"BTFC Res",           venue:"Longlevens Ground",    time:"14:30", result:"3-2", type:"Div 2"},
  {date:"2026-04-18",home:"Minety",             away:"BTFC Res",           venue:"Minety Ground",        time:"14:30", result:"8-3", type:"Div 2"},
  {date:"2026-04-14",home:"BTFC Res",           away:"Siddington Athletic",venue:"The Jessons Meadow",           time:"19:00", result:"3-0", type:"Div 2"},
  {date:"2026-04-11",home:"BTFC Res",           away:"Brockworth Albion R",venue:"The Jessons Meadow",           time:"14:30", result:"1-4", type:"Div 2"},
  {date:"2026-04-07",home:"BTFC Res",           away:"Sherston Town",      venue:"The Jessons Meadow",           time:"19:00", result:"1-3", type:"Div 2"},
  {date:"2026-04-01",home:"BTFC Res",           away:"Kingswood",          venue:"The Jessons Meadow",           time:"19:00", result:"2-3", type:"Div 2"},
  {date:"2026-03-14",home:"BTFC Res",           away:"Minety",             venue:"The Jessons Meadow",           time:"14:30", result:"3-3", type:"Div 2"},
  {date:"2026-02-28",home:"BTFC Res",           away:"Sharpness Res",      venue:"The Jessons Meadow",           time:"14:00", result:"1-4", type:"Div 2"},
  {date:"2026-02-14",home:"BTFC Res",           away:"Randwick",           venue:"The Jessons Meadow",           time:"14:00", result:"8-1", type:"Div 2"},
  {date:"2026-01-31",home:"BTFC Res",           away:"Tuffley Rovers 3rds",venue:"The Jessons Meadow",           time:"14:00", result:"2-3", type:"Div 2"},
  {date:"2026-01-10",home:"Sherston Town",      away:"BTFC Res",           venue:"Sherston Ground",      time:"14:00", result:"8-1", type:"L Cup"},
  {date:"2025-12-20",home:"Hardwicke Res",      away:"BTFC Res",           venue:"Hardwicke Ground",     time:"14:00", result:"0-1", type:"Div 2"},
  {date:"2025-12-13",home:"BTFC Res",           away:"Upton St Leonards",  venue:"The Jessons Meadow",           time:"14:00", result:"4-1", type:"Div 2"},
  {date:"2025-12-06",home:"Dursley Town 3rds",  away:"BTFC Res",           venue:"Dursley Ground",       time:"14:00", result:"4-1", type:"Div 2"},
  {date:"2025-11-22",home:"Wotton Rovers",      away:"BTFC Res",           venue:"Wotton Ground",        time:"14:00", result:"H-W", type:"Cup"},
  {date:"2025-11-15",home:"Tuffley Rovers 3rds",away:"BTFC Res",           venue:"Tuffley Ground",       time:"14:00", result:"0-3", type:"Div 2"},
  {date:"2025-11-08",home:"BTFC Res",           away:"Randwick",           venue:"The Jessons Meadow",           time:"14:00", result:"9-0", type:"L Cup"},
  {date:"2025-11-01",home:"Cam Bulldogs",       away:"BTFC Res",           venue:"Cam Ground",           time:"14:00", result:"3-0", type:"Div 2"},
  {date:"2025-10-25",home:"BTFC Res",           away:"Siddington Athletic", venue:"The Jessons Meadow",          time:"14:00", result:"4-1", type:"Cup"},
  {date:"2025-10-18",home:"Kingswood",          away:"BTFC Res",           venue:"Kingswood Ground",     time:"14:30", result:"1-2", type:"Div 2"},
  {date:"2025-10-11",home:"Upton St Leonards",  away:"BTFC Res",           venue:"Upton Ground",         time:"14:30", result:"4-1", type:"Div 2"},
  {date:"2025-10-04",home:"Brockworth Albion R",away:"BTFC Res",           venue:"Brockworth Ground",    time:"14:30", result:"5-2", type:"Div 2"},
  {date:"2025-09-27",home:"Sherston Town",      away:"BTFC Res",           venue:"Sherston Ground",      time:"14:30", result:"3-0", type:"Div 2"},
  {date:"2025-09-20",home:"Sharpness Res",      away:"BTFC Res",           venue:"Sharpness Ground",     time:"14:30", result:"4-2", type:"Div 2"}
];

var RESERVES_LEAGUE = [
  {pos:1,  team:"Cam Bulldogs",          p:26, w:23, d:2, l:1,  gd:"+78", pts:71},
  {pos:2,  team:"Brockworth Albion Res", p:26, w:21, d:2, l:3,  gd:"+77", pts:65},
  {pos:3,  team:"Sherston Town",         p:26, w:20, d:2, l:4,  gd:"+56", pts:62},
  {pos:4,  team:"Longlevens 3rds",       p:26, w:17, d:4, l:5,  gd:"+33", pts:55},
  {pos:5,  team:"Sharpness Res",         p:26, w:16, d:5, l:5,  gd:"+41", pts:53},
  {pos:6,  team:"Minety",               p:26, w:11, d:4, l:11, gd:"+10", pts:37},
  {pos:7,  team:"BTFC Res",             p:26, w:10, d:1, l:15, gd:"-11", pts:31},
  {pos:8,  team:"Hardwicke Res",        p:26, w:9,  d:3, l:14, gd:"-12", pts:30},
  {pos:9,  team:"Upton St Leonards",    p:26, w:9,  d:2, l:15, gd:"-31", pts:29},
  {pos:10, team:"Kingswood",            p:26, w:8,  d:3, l:15, gd:"-22", pts:27},
  {pos:11, team:"Dursley Town 3rds",    p:26, w:8,  d:1, l:17, gd:"-21", pts:25},
  {pos:12, team:"Tuffley Rovers 3rds",  p:26, w:7,  d:2, l:17, gd:"-37", pts:23},
  {pos:13, team:"Siddington Athletic",  p:26, w:6,  d:1, l:19, gd:"-52", pts:19},
  {pos:14, team:"Randwick",             p:26, w:1,  d:0, l:25, gd:"-109",pts:3}
];

var TICKETS = [
  {id:"adult-early",   label:"Adult Early Bird",       price:90, desc:"2026/27 Season &mdash; Early bird price, limited availability", perks:["All home league games","All home cup games","Free matchday programme","Early bird saving &mdash; save &pound;10"], best:true},
  {id:"adult",         label:"Adult",                  price:100,  desc:"2026/27 Season &mdash; All home league and cup games",           perks:["All home league games","All home cup games","Free matchday programme"]},
  {id:"concession-early", label:"Concession Early Bird", price:70, desc:"2026/27 Season &mdash; 65+ / Students with valid ID. Early bird price", perks:["All home league games","All home cup games","Free matchday programme","Early bird saving &mdash; save &pound;10"], best:true},
  {id:"concession",    label:"Concession",             price:80,  desc:"2026/27 Season &mdash; 65+ / Students with valid ID",           perks:["All home league games","All home cup games","Free matchday programme"]}
];

var POS_COLORS = {GK:"#1e3a5f",CB:"#1149D8",LB:"#3F4DA1",RB:"#3F4DA1",CM:"#041B5F",CAM:"#2563FF",LW:"#1149D8",RW:"#1149D8",ST:"#7f1d1d"};

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-GB", {weekday:"short",day:"numeric",month:"short"});
}
function isPast(d) { return new Date(d) < new Date(); }

function showPage(id) {
  document.querySelectorAll(".page").forEach(function(p) { p.classList.remove("active"); });
  document.querySelectorAll(".nav-link").forEach(function(l) { l.classList.remove("active"); });
  var pg = document.getElementById("page-" + id);
  if (pg) pg.classList.add("active");
  document.querySelectorAll(".nav-link").forEach(function(b) {
    var oc = b.getAttribute("onclick") || "";
    if (oc.indexOf(id) !== -1) b.classList.add("active");
  });
  window.scrollTo({top:0,behavior:"smooth"});
  if (id === "fixtures" || id === "home") renderFixtures(null);
  if (id === "shop") {} // shop is static
  if (id === "teams") renderSquad("All");
  if (id === "home") renderLeague();
  if (id === "tickets") renderTickets();
}

function resultColor(result, isHome) {
  if (!result) return "#1149D8";
  var parts = result.split("-");
  var h = parseInt(parts[0]), a = parseInt(parts[1]);
  var s = isHome ? h : a, c = isHome ? a : h;
  return s > c ? "#22C55E" : s === c ? "#F59E0B" : "#EF4444";
}

// Jessons Real Estate - Ground Sponsor
var JESSONS_LOGO = "/jessons-logo.png";

// Opponent badge URLs — FA Full-Time / Flashscore badge CDN
// Using a generic football badge SVG as fallback for any team not listed
var OPP_BADGES = {
  "FC Stratford":         "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/ew8qxmv7xlefgfpimgge",
  "Wantage Town":         "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/wantage",
  "Bewdley Town":         "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/bewdley",
  "Stonehouse Town":      "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/stonehouse",
  "Malmesbury Victoria":  "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/malmesbury",
  "Cheltenham Saracens":  "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/cheltenham-saracens",
  "Alcester Town":        "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/alcester",
  "Newent Town":          "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/newent",
  "Redditch Borough":     "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/redditch-borough",
  "Ludlow Town":          "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/ludlow",
  "Shortwood United":     "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/shortwood",
  "Chipping Sodbury Town":"https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/chipping-sodbury",
  "Chipping Sodbury":     "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/chipping-sodbury",
  "Carterton":            "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/carterton",
  "Woodford United":      "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/woodford",
  "Clanfield 85":         "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/clanfield",
  "Wellington":           "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/wellington",
  "Thame United Reserves":"https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/thame",
  "Thame Utd Res":        "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/thame",
  "Highworth Town":       "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/highworth",
  "Malmesbury Vic":       "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/malmesbury",
  "Cheltenham Sar":       "https://resources.cdn-assets-public.com/image/upload/f_auto,c_limit,w_32,h_32/production/team/cheltenham-saracens"
};

// Generic football badge SVG used as fallback when no badge URL is found
var GENERIC_BADGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23E5E7EB'/%3E%3Ccircle cx='20' cy='20' r='14' fill='%231149D8' opacity='0.15'/%3E%3Ctext x='20' y='25' text-anchor='middle' font-family='Barlow Condensed,sans-serif' font-size='11' fill='%236B7280'%3EFC%3C/text%3E%3C/svg%3E";

function getOppBadge(name) {
  return OPP_BADGES[name] || GENERIC_BADGE;
}

function fixtureHTML(f) {
  var isHome = f.home === "BTFC";
  var rc = resultColor(f.result, isHome);
  var rowClass = "fixture-row";
  var scoreClass = "fixture-score";
  if (f.result) {
    var parts = f.result.split("-");
    var h = parseInt(parts[0]), a = parseInt(parts[1]);
    var s = isHome ? h : a, c = isHome ? a : h;
    if (s > c)      { rowClass += " win";  scoreClass += " win"; }
    else if (s < c) { rowClass += " loss"; scoreClass += " loss"; }
    else            { rowClass += " draw"; scoreClass += " draw"; }
  } else {
    rowClass += " upcoming";
  }
  var scoreHTML = f.result
    ? "<span class=\\"" + scoreClass + "\\">" + f.result + "</span>"
    : "<span class=\\"fixture-vs\\">VS</span>";
  var typeColor = f.type === "GFA Trophy" ? "#166534" : f.type === "Cup" ? "#92400E" : f.type === "FA Cup" ? "#7f1d1d" : f.type === "FA Vase" ? "#7f1d1d" : f.type === "Floodlit Cup" ? "#374151" : "#1149D8";
  var btfcBadge = "<img src=\\"" + LOGO_URL + "\\" alt=\\"BTFC\\">";
  var oppName  = f.home === "BTFC" ? f.away : f.home;
  var oppSrc   = getOppBadge(oppName);
  var oppBadge = "<img src=\\"" + oppSrc + "\\" alt=\\"" + oppName + "\\" onerror=\\"this.src=&quot;" + GENERIC_BADGE + "&quot;\\">";
  var homeHTML = f.home === "BTFC"
    ? "<span class=\\"fixture-team btfc\\">" + btfcBadge + "BTFC</span>"
    : "<span class=\\"fixture-team opp\\">" + oppBadge + f.home + "</span>";
  var awayHTML = f.away === "BTFC"
    ? "<span class=\\"fixture-team btfc\\">" + btfcBadge + "BTFC</span>"
    : "<span class=\\"fixture-team opp\\">" + oppBadge + f.away + "</span>";
  return "<div class=\\"" + rowClass + "\\">" +
    "<div class=\\"fixture-date\\"><div class=\\"fixture-date-main\\">" + fmtDate(f.date) + "</div><div class=\\"fixture-date-sub\\">" + f.time + "</div></div>" +
    "<span class=\\"pill\\" style=\\"background:" + typeColor + ";font-size:9px;flex-shrink:0\\">" + f.type + "</span>" +
    "<div class=\\"fixture-teams\\">" + homeHTML + scoreHTML + awayHTML + "</div>" +
    "<div class=\\"fixture-venue\\">&#128205; " + f.venue + "</div>" +
  "</div>";
}

function renderFixtures(filter) {
  var sorted = FIXTURES.slice().sort(function(a,b) { return new Date(b.date) - new Date(a.date); });
  var shown = sorted;
  if (filter === "Upcoming") shown = sorted.filter(function(f) { return !isPast(f.date); });
  if (filter === "Results")  shown = sorted.filter(function(f) { return isPast(f.date); });
  var html = shown.map(fixtureHTML).join("");
  var fl = document.getElementById("fixtures-list");
  if (fl) fl.innerHTML = html;
  var hf = document.getElementById("home-fixtures");
  if (hf) hf.innerHTML = shown.slice(0,4).map(fixtureHTML).join("");
}

function filterFixtures(filter, btn) {
  document.querySelectorAll(".filter-btn").forEach(function(b) { b.classList.remove("active"); });
  btn.classList.add("active");
  renderFixtures(filter);
}

function renderLeague() {
  var html = LEAGUE.map(function(r) {
    var isBTFC = r.team === "BTFC";
    var logoHTML = isBTFC ? "<img src=\\"" + LOGO_URL + "\\" alt=\\"BTFC\\">" : "";
    return "<div class=\\"table-row" + (isBTFC ? " btfc" : "") + "\\">" +
      "<div class=\\"table-pos" + (isBTFC ? " btfc" : "") + "\\">" + r.pos + "</div>" +
      "<div class=\\"table-club" + (isBTFC ? " btfc" : "") + "\\">" + logoHTML + "<span>" + r.team + "</span></div>" +
      "<div class=\\"table-stat\\">" + r.p + "</div>" +
      "<div class=\\"table-stat\\">" + r.w + "</div>" +
      "<div class=\\"table-stat\\">" + r.d + "</div>" +
      "<div class=\\"table-stat\\">" + r.l + "</div>" +
      "<div class=\\"table-stat\\">" + r.gd + "</div>" +
      "<div class=\\"table-pts\\">" + r.pts + "</div>" +
    "</div>";
  }).join("");
  var el = document.getElementById("league-table");
  if (el) el.innerHTML = html;
}

function renderSquad(filter) {
  var shown = filter === "All" ? SQUAD : SQUAD.filter(function(p) { return p.pos === filter; });
  var el = document.getElementById("squad-grid");
  if (!el) return;
  el.innerHTML = "";
  shown.forEach(function(p) {
    var col = POS_COLORS[p.pos] || "#1149D8";
    var num = p.num < 10 ? "0" + p.num : "" + p.num;
    var div = document.createElement("div");
    div.className = "player-card";
    div.dataset.goals = p.goals;
    div.dataset.apps = p.apps;
    div.innerHTML =
      "<div class=\\"player-bar\\" style=\\"background:" + col + "\\"></div>" +
      "<div class=\\"player-body\\">" +
        "<div class=\\"player-num\\">" + num + "</div>" +
        "<span class=\\"pill\\" style=\\"background:" + col + "\\">" + p.pos + "</span>" +
        "<div class=\\"player-name\\">" + p.name + "</div>" +
        "<div class=\\"player-age\\">Age " + p.age + "</div>" +
      "</div>";
    div.addEventListener("click", function() { togglePlayer(div); });
    el.appendChild(div);
  });
}

function togglePlayer(el) {
  var wasSelected = el.classList.contains("selected");
  document.querySelectorAll(".player-card").forEach(function(c) {
    c.classList.remove("selected");
    var s = c.querySelector(".player-stats");
    if (s) s.remove();
  });
  if (!wasSelected) {
    el.classList.add("selected");
    var stats = document.createElement("div");
    stats.className = "player-stats";
    stats.innerHTML =
      "<div><div class=\\"pstat-val\\" style=\\"color:#1149D8\\">" + el.dataset.goals + "</div><div class=\\"pstat-label\\">GOALS</div></div>" +
      "<div><div class=\\"pstat-val\\" style=\\"color:#2563FF\\">" + el.dataset.apps + "</div><div class=\\"pstat-label\\">APPS</div></div>";
    el.querySelector(".player-body").appendChild(stats);
  }
}

function filterSquad(pos, btn) {
  document.querySelectorAll(".pos-btn").forEach(function(b) { b.classList.remove("active"); });
  btn.classList.add("active");
  renderSquad(pos);
}

function renderTickets() {
  var el = document.getElementById("ticket-grid");
  if (!el) return;
  el.innerHTML = "";
  TICKETS.forEach(function(t) {
    var div = document.createElement("div");
    div.className = "ticket-card";
    div.id = "ticket-" + t.id;
    var perksHTML = t.perks.map(function(p) {
      return "<li class=\\"tcard-perk\\"><span class=\\"tcard-check\\">&#10003;</span>" + p + "</li>";
    }).join("");
    var bestHTML = t.best ? "<div style=\\"position:absolute;top:12px;right:12px\\"><span class=\\"pill\\" style=\\"background:#166534\\">Best Value</span></div>" : "";
    div.innerHTML =
      bestHTML +
      "<div class=\\"tcard-bar\\"></div>" +
      "<div class=\\"tcard-label\\">" + t.label + "</div>" +
      "<div class=\\"tcard-price\\">&pound;" + t.price + "</div>" +
      "<div class=\\"tcard-desc\\">" + t.desc + "</div>" +
      "<ul class=\\"tcard-perks\\">" + perksHTML + "</ul>" +
      "<button class=\\"tcard-btn\\">Select</button>";
    div.addEventListener("click", function() { selectTicket(t.id); });
    el.appendChild(div);
  });
}

function selectTicket(id) {
  var t = null;
  for (var i = 0; i < TICKETS.length; i++) { if (TICKETS[i].id === id) { t = TICKETS[i]; break; } }
  if (!t) return;
  document.querySelectorAll(".ticket-card").forEach(function(c) { c.classList.remove("selected"); });
  var card = document.getElementById("ticket-" + id);
  if (card) card.classList.add("selected");
  var box = document.getElementById("checkout-box");
  box.style.display = "block";

  var perksHTML = t.perks.map(function(p) {
    return "<li class=\\"tcard-perk\\"><span class=\\"tcard-check\\">&#10003;</span>" + p + "</li>";
  }).join("");

  var inner = document.createElement("div");
  inner.className = "checkout-box";
  inner.innerHTML =
    "<div style=\\"font-family:Barlow Condensed,sans-serif;font-size:26px;color:#2D2D2D;letter-spacing:.04em;margin-bottom:4px\\">Order Summary</div>" +
    "<div style=\\"font-size:13px;color:#6B7280;margin-bottom:24px\\">Complete your details then proceed to our secure Zettle payment page.</div>" +
    "<div style=\\"background:#F2F2F2;border-radius:6px;padding:16px 18px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center\\">" +
      "<div><div style=\\"font-family:Barlow Condensed,sans-serif;font-size:20px;color:#2D2D2D\\">" + t.label + " Season Ticket</div><div style=\\"font-size:12px;color:#6B7280\\">" + t.desc + "</div></div>" +
      "<div style=\\"font-family:Barlow Condensed,sans-serif;font-size:28px;color:#1149D8\\">&pound;" + t.price + "</div>" +
    "</div>" +
    "<label class=\\"form-label\\">Full Name <span style=\\"color:#EF4444\\">*</span></label><input class=\\"form-input\\" id=\\"t-name\\" placeholder=\\"John Smith\\" oninput=\\"this.style.borderColor='#E5E7EB'\\">" +
    "<label class=\\"form-label\\">Email Address <span style=\\"color:#EF4444\\">*</span></label><input class=\\"form-input\\" id=\\"t-email\\" type=\\"email\\" placeholder=\\"john@example.com\\" oninput=\\"this.style.borderColor='#E5E7EB'\\">" +
    "<label class=\\"form-label\\">Phone Number <span style=\\"color:#EF4444\\">*</span></label><input class=\\"form-input\\" id=\\"t-phone\\" type=\\"tel\\" placeholder=\\"07700 900000\\" oninput=\\"this.style.borderColor='#E5E7EB'\\">" +
    "<div id=\\"t-error\\" style=\\"display:none;background:#FEF2F2;border:1px solid #EF4444;border-radius:6px;padding:10px 14px;margin-bottom:16px;font-size:12px;color:#DC2626;font-weight:600\\"></div>" +
    "<div style=\\"background:rgba(17,73,216,.06);border:1px solid rgba(17,73,216,.2);border-radius:6px;padding:12px 16px;margin-bottom:24px;display:flex;gap:10px\\">" +
      "<span style=\\"font-size:18px;flex-shrink:0\\">&#128274;</span>" +
      "<p style=\\"font-size:12px;color:#374151;line-height:1.55;margin:0\\"><strong>Secure payment via Zettle.</strong> Opens a new tab to pay safely by card. After payment you will receive a confirmation email with your season ticket &mdash; show it on your phone at the gate or <strong>print it at home</strong>. Both work fine.</p>" +
    "</div>";

  var payBtn = document.createElement("button");
  payBtn.style.cssText = "width:100%;background:#1149D8;color:#fff;border:none;padding:16px;border-radius:6px;font-family:Montserrat,sans-serif;font-weight:800;font-size:14px;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;margin-bottom:12px";
  payBtn.textContent = "Continue to Payment";
  payBtn.addEventListener("click", function() {
    var nameVal  = document.getElementById("t-name")  ? document.getElementById("t-name").value.trim()  : "";
    var emailVal = document.getElementById("t-email") ? document.getElementById("t-email").value.trim() : "";
    var phoneVal = document.getElementById("t-phone") ? document.getElementById("t-phone").value.trim() : "";
    var errorEl  = document.getElementById("t-error");

    // Clear previous error
    if (errorEl) errorEl.style.display = "none";

    // Validate
    if (!nameVal) {
      document.getElementById("t-name").style.borderColor = "#EF4444";
      document.getElementById("t-name").focus();
      if (errorEl) { errorEl.textContent = "Please enter your full name."; errorEl.style.display = "block"; }
      return;
    }
    if (!emailVal || !emailVal.includes("@")) {
      document.getElementById("t-email").style.borderColor = "#EF4444";
      document.getElementById("t-email").focus();
      if (errorEl) { errorEl.textContent = "Please enter a valid email address."; errorEl.style.display = "block"; }
      return;
    }
    if (!phoneVal) {
      document.getElementById("t-phone").style.borderColor = "#EF4444";
      document.getElementById("t-phone").focus();
      if (errorEl) { errorEl.textContent = "Please enter your phone number."; errorEl.style.display = "block"; }
      return;
    }

    // All good — reset borders and proceed to Zettle
    document.getElementById("t-name").style.borderColor  = "#22C55E";
    document.getElementById("t-email").style.borderColor = "#22C55E";
    document.getElementById("t-phone").style.borderColor = "#22C55E";
    window.open(ZETTLE, "_blank");
  });
  inner.appendChild(payBtn);

  var changeBtn = document.createElement("div");
  changeBtn.style.cssText = "text-align:center";
  changeBtn.innerHTML = "<button style=\\"background:none;border:none;color:#9CA3AF;font-size:12px;cursor:pointer;text-decoration:underline\\" id=\\"change-ticket-btn\\">Change ticket type</button>";
  inner.appendChild(changeBtn);

  box.innerHTML = "";
  box.appendChild(inner);

  document.getElementById("change-ticket-btn").addEventListener("click", function() {
    box.style.display = "none";
    document.querySelectorAll(".ticket-card").forEach(function(c) { c.classList.remove("selected"); });
  });

  box.scrollIntoView({behavior:"smooth",block:"start"});
}

function sendMsg() {
  var wrap = document.getElementById("contact-form-wrap");
  if (wrap) {
    wrap.innerHTML =
      "<div style=\\"text-align:center;padding:60px 40px;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);border-radius:8px\\">" +
      "<div style=\\"font-family:Barlow Condensed,sans-serif;font-size:52px;color:#22C55E;margin-bottom:8px\\">&#10003;</div>" +
      "<h3 style=\\"font-family:Barlow Condensed,sans-serif;font-size:30px;color:#22C55E;letter-spacing:.04em\\">Message Sent!</h3>" +
      "<p style=\\"color:rgba(255,255,255,.5);font-size:14px\\">We will get back to you within 48 hours.</p></div>";
  }
}

function showTeam(id, btn) {
  document.querySelectorAll("#team-first,#team-reserves,#team-u17").forEach(function(el) { el.style.display = "none"; });
  document.querySelectorAll("#tab-first,#tab-reserves,#tab-u17").forEach(function(b) {
    b.style.background = "transparent";
    b.style.color = "#1149D8";
  });
  document.getElementById("team-" + id).style.display = "block";
  if (btn) { btn.style.background = "#1149D8"; btn.style.color = "#fff"; }
  if (id === "reserves") { renderReservesSquad(); renderReservesFixtures(null); renderReservesLeague(); }
}

function reserveFixtureHTML(f) {
  var isBTFC = f.home === "BTFC Res";
  var rc = resultColor(f.result === "H-W" ? null : f.result, isBTFC);
  if (f.result === "H-W") rc = "#F59E0B";
  var scoreHTML = f.result
    ? "<span class=\\"fixture-score\\" style=\\"color:" + rc + "\\">" + f.result + "</span>"
    : "<span class=\\"fixture-vs\\">VS</span>";
  var typeColor = f.type === "L Cup" || f.type === "Cup" ? "#92400E" : f.type === "CC" || f.type === "Cup (North)" ? "#166534" : "#1149D8";
  var btfcBadge = "<img src=\\"" + LOGO_URL + "\\" alt=\\"BTFC\\" style=\\"width:22px;height:22px;border-radius:50%;background:#fff;border:1.5px solid #1149D8;vertical-align:middle\\">";
  var homeHTML = f.home === "BTFC Res"
    ? "<span class=\\"fixture-team btfc\\" style=\\"font-size:18px\\">" + btfcBadge + "&nbsp;BTFC Res</span>"
    : "<span class=\\"fixture-team opp\\">" + f.home + "</span>";
  var awayHTML = f.away === "BTFC Res"
    ? "<span class=\\"fixture-team btfc\\" style=\\"font-size:18px\\">" + btfcBadge + "&nbsp;BTFC Res</span>"
    : "<span class=\\"fixture-team opp\\">" + f.away + "</span>";
  return "<div class=\\"fixture-row\\" style=\\"border-left-color:" + rc + "\\">" +
    "<div class=\\"fixture-date\\"><div class=\\"fixture-date-main\\">" + fmtDate(f.date) + "</div><div class=\\"fixture-date-sub\\">" + f.time + "</div></div>" +
    "<span class=\\"pill\\" style=\\"background:" + typeColor + ";font-size:9px\\">" + f.type + "</span>" +
    "<div class=\\"fixture-teams\\">" + homeHTML + scoreHTML + awayHTML + "</div>" +
    "<div class=\\"fixture-venue\\">&#128205; " + f.venue + "</div>" +
  "</div>";
}

function renderReservesFixtures(filter) {
  var sorted = RESERVES_FIXTURES.slice().sort(function(a,b) { return new Date(b.date) - new Date(a.date); });
  var shown = sorted;
  if (filter === "Upcoming") shown = sorted.filter(function(f) { return !isPast(f.date); });
  if (filter === "Results")  shown = sorted.filter(function(f) { return isPast(f.date); });
  var el = document.getElementById("reserves-fixtures-list");
  if (el) el.innerHTML = shown.map(reserveFixtureHTML).join("");
}

function filterReserves(filter, btn) {
  document.querySelectorAll(".filter-btn").forEach(function(b) { b.classList.remove("active"); });
  btn.classList.add("active");
  renderReservesFixtures(filter);
}

function renderReservesLeague() {
  var el = document.getElementById("reserves-league-table");
  if (!el) return;
  el.innerHTML = RESERVES_LEAGUE.map(function(r) {
    var isBTFC = r.team === "BTFC Res";
    var logoHTML = isBTFC ? "<img src=\\"" + LOGO_URL + "\\" alt=\\"BTFC\\" style=\\"width:18px;height:18px;border-radius:50%;background:#fff;margin-right:4px\\">" : "";
    return "<div class=\\"table-row" + (isBTFC ? " btfc" : "") + "\\">" +
      "<div class=\\"table-pos" + (isBTFC ? " btfc" : "") + "\\">" + r.pos + "</div>" +
      "<div class=\\"table-club" + (isBTFC ? " btfc" : "") + "\\">" + logoHTML + "<span>" + r.team + "</span></div>" +
      "<div class=\\"table-stat\\">" + r.p + "</div>" +
      "<div class=\\"table-stat\\">" + r.w + "</div>" +
      "<div class=\\"table-stat\\">" + r.d + "</div>" +
      "<div class=\\"table-stat\\">" + r.l + "</div>" +
      "<div class=\\"table-stat\\">" + r.gd + "</div>" +
      "<div class=\\"table-pts\\">" + r.pts + "</div>" +
    "</div>";
  }).join("");
}

function renderReservesSquad() {
  var el = document.getElementById("reserves-grid");
  if (!el) return;
  el.innerHTML = "";
  RESERVES_SQUAD.forEach(function(p) {
    var col = "#3F4DA1";
    var num = p.num < 10 ? "0" + p.num : "" + p.num;
    var div = document.createElement("div");
    div.className = "player-card";
    div.dataset.goals = p.goals;
    div.dataset.apps = p.apps;
    div.innerHTML =
      "<div class=\\"player-bar\\" style=\\"background:" + col + "\\"></div>" +
      "<div class=\\"player-body\\">" +
        "<div class=\\"player-num\\">" + num + "</div>" +
        "<span class=\\"pill\\" style=\\"background:" + col + "\\">" + p.pos + "</span>" +
        "<div class=\\"player-name\\">" + p.name + "</div>" +
      "</div>";
    div.addEventListener("click", function() { togglePlayer(div); });
    el.appendChild(div);
  });
}

renderFixtures(null);
renderLeague();
renderSquad("All");
renderTickets();

// Set logo images
var logoImgs = document.querySelectorAll("#first-logo,#reserves-logo,#u17-logo");
logoImgs.forEach(function(img) { img.src = LOGO_URL; });
`}} />
    </>
  )
}
