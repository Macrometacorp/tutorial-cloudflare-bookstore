const CUSTOMER_ID = "customerId";

const getCustomerId = () => sessionStorage.getItem(CUSTOMER_ID);

const setCustomerId = (customerId: string) =>
  sessionStorage.setItem(CUSTOMER_ID, customerId);

const getOptions = (opts: any) => ({
  ...opts,
  headers: { "X-Customer-Id": getCustomerId() },
});

const Auth = {
  currentSession: function () {
    return fetch("./api/whoami", getOptions({ method: "GET" }));
  },
  signOut: function () {
    sessionStorage.setItem(CUSTOMER_ID, "");
    return true;
  },
  signIn: async function (email: string, password: string) {
    const res = await fetch(
      "./api/signin",
      getOptions({
        method: "POST",
        body: JSON.stringify({ username: email, password }),
      })
    );
    const data = await res.json();
    const customerId = data.message[0];
    setCustomerId(customerId);
    return true;
  },
  signUp: function (email: string, password: string) {
    return fetch(
      "./api/signup",
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
    const res = await fetch(`./api${path}`, getOptions({ method: "GET" }));
    return res.json();
  },
  post: async function (key: string, path: string, data: any) {
    const res = await fetch(
      `./api${path}`,
      getOptions({ method: "POST", body: JSON.stringify(data.body) })
    );
    return res.json();
  },
  put: async function (key: string, path: string, data: any) {
    const res = await fetch(
      `./api${path}`,
      getOptions({ method: "PUT", body: JSON.stringify(data.body) })
    );
    return res.json();
  },
  del: async function (key: string, path: string, data: any) {
    const res = await fetch(
      `./api${path}`,
      getOptions({ method: "DELETE", body: JSON.stringify(data.body) })
    );
  },
};

export { Auth, API };
