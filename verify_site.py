from pathlib import Path
import base64, hashlib, json, os, socket, struct, subprocess, time, urllib.request, re
from bs4 import BeautifulSoup

root = Path(__file__).parent.resolve()
out = root / 'design-review'
out.mkdir(exist_ok=True)
errors=[]
for path in root.glob('*.html'):
    soup=BeautifulSoup(path.read_text(encoding='utf-8'),'html.parser')
    for node in soup.select('[href], [src]'):
        link=node.get('href',node.get('src',''))
        if not link or link.startswith(('http:', 'https:', 'data:', 'mailto:')): continue
        name=link.split('#')[0].split('?')[0]
        target=root/name if name else path
        if not target.exists(): errors.append(f'{path.name}: missing {link}')
        if '#' in link and target.suffix == '.html' and target.exists():
            fragment=link.split('#',1)[1]
            if fragment and not BeautifulSoup(target.read_text(encoding='utf-8'),'html.parser').find(id=fragment): errors.append(f'{path.name}: missing anchor {link}')
print('Static links:', errors or 'PASS')

edge=Path('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe')
port=9338
proc=subprocess.Popen([str(edge),'--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check',f'--remote-debugging-port={port}','--remote-allow-origins=*',f'--user-data-dir={out / "browser-profile"}','about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,creationflags=subprocess.CREATE_NO_WINDOW)
try:
    for _ in range(50):
        try:
            targets=json.load(urllib.request.urlopen(f'http://127.0.0.1:{port}/json',timeout=1));break
        except Exception:time.sleep(.2)
    else: raise RuntimeError('Browser debugging endpoint unavailable')
    url=next(t['webSocketDebuggerUrl'] for t in targets if t['type']=='page')
    from urllib.parse import urlparse
    u=urlparse(url); sock=socket.create_connection((u.hostname,u.port),timeout=15)
    key=base64.b64encode(os.urandom(16)).decode()
    sock.sendall(f'GET {u.path} HTTP/1.1\r\nHost: {u.netloc}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n'.encode())
    reply=b''
    while not reply.endswith(b'\r\n\r\n'): reply+=sock.recv(1)
    if b'101' not in reply: raise RuntimeError(reply)
    seq=0; runtime_errors=[]
    def read(n):
        b=b''
        while len(b)<n:
            chunk=sock.recv(n-len(b))
            if not chunk: raise EOFError()
            b+=chunk
        return b
    def receive():
        h=read(2); length=h[1]&127
        if length==126: length=struct.unpack('!H',read(2))[0]
        elif length==127:length=struct.unpack('!Q',read(8))[0]
        mask=read(4) if h[1]&128 else None
        data=read(length)
        if mask:data=bytes(x^mask[i%4] for i,x in enumerate(data))
        return json.loads(data)
    def call(method,params=None):
        global seq
        seq+=1; ident=seq
        data=json.dumps({'id':ident,'method':method,'params':params or {}}).encode(); n=len(data); mask=os.urandom(4)
        head=bytes([129,128 | (n if n<126 else 126 if n<65536 else 127)])
        if n>=126: head+=struct.pack('!H' if n<65536 else '!Q',n)
        sock.sendall(head+mask+bytes(x^mask[i%4] for i,x in enumerate(data)))
        while True:
            message=receive()
            if message.get('method')=='Runtime.exceptionThrown':runtime_errors.append(message['params'])
            if message.get('id')==ident:
                if 'error' in message:raise RuntimeError(message['error'])
                return message.get('result',{})
    def js(expression):return call('Runtime.evaluate',{'expression':expression,'returnByValue':True})['result'].get('value')
    call('Page.enable');call('Runtime.enable')
    def navigate(page,width):
        call('Emulation.setDeviceMetricsOverride',{'width':width,'height':900,'deviceScaleFactor':1,'mobile':False})
        call('Page.navigate',{'url':(root/page.split('?')[0]).as_uri()+('?' +page.split('?')[1] if '?' in page else '')})
        for _ in range(30):
            if js('document.readyState')=='complete':break
            time.sleep(.1)
        call('Runtime.evaluate', {'expression':'Promise.all([...document.images].map(i=>{i.loading="eager";return i.decode().catch(()=>null)}))','awaitPromise':True})
        time.sleep(.15)
    results=[]
    teacher_ids=['amber','neitzu','rex','lixinhan','inch','yushan','yuqing']
    pages=[p.name for p in root.glob('*.html') if p.name!='dance-corporate.html']+['teacher.html?id='+id for id in teacher_ids]
    for width in [1440,390,320]:
        for page in pages:
            navigate(page,width)
            data=js('JSON.stringify({title:document.title,overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),h1:document.querySelector("h1")?.textContent})')
            data=json.loads(data);data.update(page=page,width=width);results.append(data)
            if data['overflow'] or data['broken'] or not data.get('h1'):errors.append(data)
            if (page in ['index.html','teachers.html','boxing-kids.html','dance-hiphop.html','dance.html'] or page.startswith('teacher.html?id=')) and width in [1440,390]:
                metrics=call('Page.getLayoutMetrics')['cssContentSize']
                capture=call('Page.captureScreenshot',{'format':'png','captureBeyondViewport':True,'clip':{'x':0,'y':0,'width':width,'height':metrics['height'],'scale':1}})
                (out/f'{page.replace(".html", "").replace("?id=", "-")}-{width}.png').write_bytes(base64.b64decode(capture['data']))
    expected_courses={
      'dance-mv.html':['amber'], 'dance-jazz.html':['amber','rex'],
      'dance-kids.html':['amber'], 'dance-hiphop.html':['rex','lixinhan'],
      'dance-cheerleading.html':['neitzu'],
      'boxing-beginner.html':['inch','yushan','yuqing'],
      'boxing-advanced.html':['inch','yushan','yuqing'],
      'boxing-sparring.html':['inch','yushan','yuqing'],
      'boxing-kids.html':['inch','yushan','yuqing']
    }
    for page, expected in expected_courses.items():
        navigate(page,390)
        actual=js('[...document.querySelectorAll(".teacher-card")].map(card=>card.dataset.teacherId)')
        assert actual==expected, (page,actual,expected)
    for teacher_id in teacher_ids:
        navigate('teacher.html?id='+teacher_id,390)
        expected=[page for page,ids in expected_courses.items() if teacher_id in ids]
        actual=js('[...document.querySelectorAll(".profile-course-card")].map(a=>a.getAttribute("href"))')
        assert sorted(actual)==sorted(expected), (teacher_id,actual,expected)
        js('document.querySelector(".booking-trigger").click()')
        assert js('document.querySelector(".contact-dialog").open'), teacher_id
    navigate('teachers.html',390)
    assert js('document.querySelectorAll(".teacher-summary").length')==7
    js('const filter=document.querySelector("#teacher-course-filter");filter.value="boxing-kids";filter.dispatchEvent(new Event("change"))')
    assert js('[...document.querySelectorAll(".teacher-summary")].map(card=>card.dataset.teacherId)')==['inch','yushan','yuqing']
    navigate('teachers.html?course=hiphop',390)
    assert js('[...document.querySelectorAll(".teacher-summary")].map(card=>card.dataset.teacherId)')==['rex','lixinhan']
    navigate('teacher.html?id=not-a-teacher',390)
    assert js('document.querySelectorAll(".booking-trigger").length')==0
    assert js('document.querySelector("h1").textContent')=='找不到這位老師'
    navigate('index.html',390)
    js('document.querySelector(".menu-toggle").click()')
    assert js('getComputedStyle(document.querySelector(".top-nav")).display')!='none'
    js('document.querySelector(".menu-toggle").dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:true}))')
    assert js('document.querySelector(".menu-toggle").getAttribute("aria-expanded")')=='false'
    js('document.querySelector("#tab-boxing").click()')
    assert js('document.querySelector("#panel-dance").hidden && !document.querySelector("#panel-boxing").hidden')
    js('document.querySelector("#tab-boxing").dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowLeft",bubbles:true}))')
    assert js('document.querySelector("#tab-dance").getAttribute("aria-selected")')=='true'
    js('document.querySelector(".home-process [data-contact]").click()')
    assert js('document.querySelector(".contact-dialog").open')
    js('document.querySelector(".contact-return").click()')
    assert js('!document.querySelector(".contact-dialog").open')
    navigate('teacher.html?id=inch',390)
    js('document.querySelector(".booking-trigger").click()')
    assert js('document.querySelector(".contact-dialog").open && !document.querySelector(".booking-dialog").open')
    js('document.querySelector(".contact-return").click()')
    js('''(() => {
      const date = new Date(); date.setDate(date.getDate()+1);
      const parts = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
      const get = type => parts.find(p=>p.type===type).value;
      window.testDate = `${get('year')}-${get('month')}-${get('day')}`;
      window.teacherSchedules.inch.dates[window.testDate] = [
        {start:'10:00',end:'11:00',booked:false},
        {start:'14:00',end:'15:00',booked:true},
        {start:'14:30',end:'15:30',booked:false}];
      document.querySelector('.booking-trigger').click();
    })()''')
    assert js('document.querySelector(".booking-dialog").open')
    if not js('!!document.querySelector(`[data-date="${testDate}"]`)'): js('document.querySelector("[data-month=\\"1\\"]").click()')
    js('document.querySelector(`[data-date="${testDate}"]`).click()')
    assert js('document.querySelectorAll(".booking-slot:disabled").length')==2
    js('document.querySelector(".booking-slot:not(:disabled)").click()')
    assert js('!document.querySelector(".calendar-send").disabled')
    js('document.querySelector(".calendar-send").click()')
    assert js('document.querySelector(".contact-dialog").open && !document.querySelector(".booking-dialog").open')
    js('document.querySelector(".contact-return").click();window.siteConfig.lineUrl="https://example.com/line-test";window.open=(url)=>{window.testOpenedUrl=url};document.querySelector("[data-contact]").click()')
    assert js('window.testOpenedUrl')=='https://example.com/line-test'
    report={'pages':results,'errors':errors,'runtime_errors':runtime_errors,'interactions':'PASS'}
    (out/'checks.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'pages_checked':len(results),'errors':errors,'runtime_errors':runtime_errors,'interactions':'PASS'},ensure_ascii=False))
finally:
    proc.terminate()
