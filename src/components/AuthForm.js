import produce from "immer";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { credentialState } from '../Atoms'

const AuthForm = () => {
  const [credentials, setCredentials] = useRecoilState(credentialState);
  console.log(credentials);
  function getAuthData({ name, value }) {
    setCredentials((prvState) =>
      produce(prvState, (draft) => {
        draft[name] = value
      })
    );
  }

  function sendSecret() {
    let response = window.open(`https://login.mailchimp.com/oauth2/authorize?response_type=code&client_id=${credentials.clientId}&redirect_uri=${credentials.url}`, `_blank`, `toolbar=yes, scrollbars=yes, resizable=yes,top=50,left=200,width=600,`);
  }

  function setUrlToLocalStorage() {
    console.log('test', window, window.open())
    if (window.opener) {
      localStorage.setItem('url', window.location.search)

      const code = window.location.search
      if(code){
        window.close()
      }
      fetch('http://localhost/mailchimp-php/index.php', {
        method: 'POST',
        body: code
      })
    }
  }

  useEffect(() => {
    setUrlToLocalStorage()
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
            //onClick={sendSecret}
            name="submit"
          >
            Auth
          </button>
        </div>
      </form>

    </div>
  );
};

export default AuthForm;
