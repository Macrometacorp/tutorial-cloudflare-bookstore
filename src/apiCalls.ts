const CUSTOMER_ID = "customerId";

const getCustomerId = () => sessionStorage.getItem(CUSTOMER_ID);

const setCustomerId = (customerId: string) =>
  sessionStorage.setItem(CUSTOMER_ID, customerId);

const getOptions = (opts: any) => ({
  ...opts,
  headers: { "X-Customer-Id": getCustomerId() },
});

const Auth = {
  currentSession: async function () {
    const res = await fetch("./whoami", getOptions({ method: "GET" }));
    if (res.status === 200) {
      return true;
    }
    const body = await res.json();
    throw body.message;
  },
  signOut: function () {
    sessionStorage.setItem(CUSTOMER_ID, "");
    return true;
  },
  signIn: async function (email: string, password: string) {
    const res = await fetch(
      "./signin",
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
      "./signup",
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
    const res = await fetch(`.${path}`, getOptions({ method: "GET" }));
    return res.json();
  },
  post: async function (key: string, path: string, data: any) {
    const res = await fetch(
      `.${path}`,
      getOptions({ method: "POST", body: JSON.stringify(data.body) })
    );
    return res.json();
  },
  put: async function (key: string, path: string, data: any) {
    const res = await fetch(
      `.${path}`,
      getOptions({ method: "PUT", body: JSON.stringify(data.body) })
    );
    return res.json();
  },
  del: async function (key: string, path: string, data: any) {
    const res = await fetch(
      `.${path}`,
      getOptions({ method: "DELETE", body: JSON.stringify(data.body) })
    );
  },
};

export { Auth, API };
