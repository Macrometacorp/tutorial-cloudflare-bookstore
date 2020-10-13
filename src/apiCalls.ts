const CUSTOMER_ID = "customerId";

const getCustomerId = () => sessionStorage.getItem(CUSTOMER_ID);

const setCustomerId = (customerId: string) =>
  sessionStorage.setItem(CUSTOMER_ID, customerId);

const getOptions = (opts: any) => ({
  ...opts,
  headers: { "X-Customer-Id": getCustomerId() },
});

const fetchWrapper = async (url: string, options: object) => {
  const apiUrl = `./api${url}`;
  const res = await fetch(apiUrl, options);
  if (res.ok) {
    return res.json();
  } else {
    throw res;
  }
};

const Auth = {
  currentSession: async function () {
    return await fetchWrapper("/whoami", getOptions({ method: "GET" }));
  },
  signOut: function () {
    sessionStorage.setItem(CUSTOMER_ID, "");
    return true;
  },
  signIn: async function (email: string, password: string) {
    try {
      const data = await fetchWrapper(
        "/signin",
        getOptions({
          method: "POST",
          body: JSON.stringify({ username: email, password }),
        })
      );
      const customerId = data.message[0];
      setCustomerId(customerId);
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    }
  },
  signUp: function (email: string, password: string) {
    return fetchWrapper(
      "/signup",
      getOptions({
        method: "POST",
        body: JSON.stringify({ username: email, password }),
      })
    );
  },
  currentUserInfo: function () {},
  confirmSignUp: function () {},
  confirmSignIn: function () {},
};

const API = {
  get: async function (key: string, path: string, extra: any) {
    return await fetchWrapper(path, getOptions({ method: "GET" }));
  },
  post: async function (key: string, path: string, data: any) {
    return await await fetchWrapper(
      path,
      getOptions({ method: "POST", body: JSON.stringify(data.body) })
    );
  },
  put: async function (key: string, path: string, data: any) {
    return await fetchWrapper(
      path,
      getOptions({ method: "PUT", body: JSON.stringify(data.body) })
    );
  },
  del: async function (key: string, path: string, data: any) {
    return await fetchWrapper(
      path,
      getOptions({ method: "DELETE", body: JSON.stringify(data.body) })
    );
  },
};

export { Auth, API };
