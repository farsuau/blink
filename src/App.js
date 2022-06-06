import './App.scss';
import React, {useState, useEffect} from 'react';

function LocaleLink ({locale, url, path}) {
  let finalLink = url.split("<>").join(locale);
  if (path) {
    finalLink = finalLink.split("[]").join(path)
  }
  return (
    <p className="generated-link">
      <a
        className="url"
        target="_blank"
        href={finalLink}
      >{finalLink}</a>
    </p>
  )
}

const regExp = /[^,\s"']+/g;

function openAll() {
  const anchors = [...document.getElementsByClassName("url")];
  anchors.map((anchor) => {
    window.open(anchor.getAttribute("href"))
  })
}

function copyAll() {
  const anchors = [...document.getElementsByClassName("url")];
  return navigator.clipboard.writeText(anchors.join("\n"));
}

function copyLocales() {
  const localesTextArray = document.getElementById("locales-array").innerText;
  return navigator.clipboard.writeText(localesTextArray);
}

function App() {
  const [url, setUrl] = useState('');
  const [paths, setPaths] = useState([]);
  const [locales, setLocales] = useState([]);
  const [urlOrder, setUrlOrder] = useState('locale');
  const [interval, setInterval] = useState(3000);
  const currentUrl = new URL(window.location.href);

  useEffect(() => {
    const storedUrl = localStorage.getItem("url");
    const storedPaths = localStorage.getItem("paths");
    const storedLocales = localStorage.getItem("locales");

    const pathsInput = document.getElementsByClassName("paths-input");
    const localesInput = document.getElementById("locales-input");
    const intervalInput = document.getElementsByClassName("interval-input");

    if (currentUrl.searchParams.get("url")) {
      setUrl(currentUrl.searchParams.get("url"))
    } else if (storedUrl) {
      setUrl(storedUrl);
    }

    if (currentUrl.searchParams.get("paths")) {
      pathsInput[0].value = currentUrl.searchParams.get("paths");
      handlePathInput(currentUrl.searchParams.get("paths"));
    } else if (storedPaths) {
      pathsInput[0].value = storedPaths;
      handlePathInput(storedPaths);
    }

    if (currentUrl.searchParams.get("locales")) {
      localesInput.value = currentUrl.searchParams.get("locales");
      handleLocalesInput(currentUrl.searchParams.get("locales"));
    } else if (storedLocales) {
      localesInput.value = storedLocales;
      handleLocalesInput(storedLocales);
    }
  }, []);

  function handleUrlInput(value) {
    setUrl(value);
    localStorage.setItem("url", value);
  }

  function handlePathInput(value) {
    setPaths(value.match(regExp));
    localStorage.setItem('paths', value);
  }

  function handleLocalesInput(value) {
    setLocales(value.match(regExp));
    localStorage.setItem("locales", value);
  }

  function handleIntervalInput(value) {
    setInterval(value);
  }

  function openAllSlowly() {
    const anchors = [...document.getElementsByClassName("url")];
    anchors.map((anchor, index) => {
      setTimeout(() => {
        window.open(anchor.getAttribute("href"))
      }, interval*index )
    })
  }

  function changeUrlOrder(value) {
    setUrlOrder(value);
  }

  function createParams() {
    let urlWithParams = `${currentUrl.origin}/?url=${url}&paths=${paths}&locales=${locales}`;
    return navigator.clipboard.writeText(urlWithParams);
  }

  return (
    <div className="main">
      <header className="header">
        Blink
      </header>

      <div className="wrapper">
        <section className="section settings">

          <h1>URL</h1>
          <h5>
            add &lt;&gt; where locale code should go inside url<br></br>
            add [] to replace using multiple paths (optional)
          </h5>

          <input
            value={url}
            className="url-input"
            type="text"
            onChange={e => handleUrlInput(e.target.value)}
            placeholder="https://someurl.com/intl/<>/[]"
          />

          <h1>PATHS</h1>
          <h5>make sure to empty this field if you're not using it</h5>
          <input
            className="paths-input"
            type="text"
            onChange={e => handlePathInput(e.target.value)}
            placeholder="home products about..."
          />

          <h1>LOCALES</h1>
          <textarea
            id="locales-input"
            onChange={e => handleLocalesInput(e.target.value)}>
          </textarea>

          <button
            className="btn"
            onClick={createParams}>
              copy url with this config
          </button>

        </section>
        <section className="section">

          <h4>links</h4>

          order by:
          <input onChange={e => changeUrlOrder(e.target.value)} type="radio" name="order" value="locale"/> locale
          <input onChange={e => changeUrlOrder(e.target.value)} type="radio" name="order" value="path"/> path
          <br></br>
          <br></br>

          <div className="final-url-container">

            {url && locales &&
              paths?.length
              ? urlOrder == 'path'
                ? paths.map((path, index) => (
                  locales.map((locale, index) => (
                    <LocaleLink
                      locale = {locale}
                      url = {url}
                      key = {index}
                      path = {path}
                    />
                  ))
                ))
                : locales.map((locale, index) => (
                  paths.map((path, index) => (
                    <LocaleLink
                      locale = {locale}
                      url = {url}
                      key = {index}
                      path = {path}
                    />
                  ))
                ))
              : locales?.map((locale, index) => (
                <LocaleLink
                  locale = {locale}
                  url = {url}
                  key = {index}
                />
              ))
            }
          </div>

          <button
            className="btn"
            onClick={openAll}>
              open all
          </button>
          <div className="flex-column">
            <button
              className="btn"
              onClick={openAllSlowly}>
                open all slowly
            </button>
            <input
              value={interval}
              className="interval-input"
              type="number"
              onChange={e => handleIntervalInput(e.target.value)}
              placeholder="3000"
              min="1"
              max="10000"
            /> ms
          </div>
          <button
            className="btn"
            onClick={copyAll}>
              copy all
          </button>

          <h4>scorpion:</h4>
          <p id="locales-array">
            {locales &&
              locales.map((locale, index) => (
                `"${locale}"` + (index === locales.length-1 ? "" : ", ")
              ))
            }
          </p>
          <button
            className="btn"
            onClick={copyLocales}>
              copy locales
          </button>

        </section>
      </div>
    </div>
  );
}

export default App;
