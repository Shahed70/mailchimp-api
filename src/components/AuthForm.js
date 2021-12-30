import produce from "immer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { credentialState } from '../Atoms'

const AuthForm = ({ setCode }) => {
  const [credentials, setCredentials] = useRecoilState(credentialState);

  const [authorized, setAuthorized] = useState(false)

  const getAuthData = ({ name, value }) => {
    setCredentials((prvState) =>
      produce(prvState, (draft) => {
        draft[name] = value
      })
    );
  }

  const getAccessTokenByCode = code => {
    fetch('http://localhost/mailchimp-php/generate_access_token.php', {
      method: 'POST',
      body: code
    }).then(res => res.json())
      .then(data => {
        setCredentials((prvState) =>
          produce(prvState, (draft) => {
            draft.code = data
          })
        );

        localStorage.removeItem('mailchimp_code')
      })
  }

  const sendSecret = e => {
    e.preventDefault()
    let authWindow = window.open(`https://login.mailchimp.com/oauth2/authorize?response_type=code&client_id=${credentials.clientId}&redirect_uri=${credentials.url}`, `_blank`, `toolbar=yes, scrollbars=yes, resizable=yes,top=50,left=200,width=600,`);

    const popupURLCheckTimer = setInterval(() => {
      if (authWindow.closed) {
        clearInterval(popupURLCheckTimer)
        const mailchimp_code = localStorage.getItem('mailchimp_code')
        if (mailchimp_code) {
          getAccessTokenByCode(mailchimp_code)
          setAuthorized(true)
        }
      }
    }, 500)
  }

  const setAuthToLocalStorage = () => {
    if (window.opener) {
      let code = window.location.search.split('=')[1]
      localStorage.setItem('mailchimp_code', code)
      if (code) {
        window.close()
      }
    }
  }

  useEffect(() => {
    setAuthToLocalStorage()
  }, [])

  return (
    <div className="w-full max-w-md">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={sendSecret} >
        <h1 className="text-center text-2xl font-bold py-5">Mailchimp Auth</h1>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="id"
          >
            CLIENT_ID
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="id"
            type="text"
            name="clientId"
            placeholder="id"
            onChange={(e) => getAuthData(e.target)}
          />
        </div>
        <div className="mb-6">
          <label
            className="block uppercase text-gray-700 text-sm font-bold mb-2"
            htmlFor="secret"
          >
            client_secret
          </label>
          <input
            className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="secret"
            type="text"
            name="clientSecret"
            placeholder="secret"
            onChange={(e) => getAuthData(e.target)}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="url"
          >
            URL
          </label>
          <input
            className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="url"
            text="url"
            name="url"
            placeholder="password"
            onChange={e => getAuthData(e.target)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button

            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
            name="submit"
          >
            Auth
          </button>

          {
            authorized ? <Link
              to="/newForm"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Next
            </Link> : ""
          }

        </div>
      </form>

    </div>
  );
};

export default AuthForm;
