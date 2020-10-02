const CUSTOMER_ID = "customerId";

const getCustomerId = () => sessionStorage.getItem(CUSTOMER_ID);

const getOptions = (opts: any) => ({
  ...opts,
  headers: { "X-Customer-Id": getCustomerId() },
});

const Auth = {
  currentSession: function () {
    return fetch("./whoami", getOptions({ method: "GET" }));
  },
  signOut: function () {
    sessionStorage.setItem(CUSTOMER_ID, "");
    return true;
  },
  signIn: function (email: string, password: string) {
    return fetch(
      "./signin",
      getOptions({
        method: "POST",
        body: JSON.stringify({ username: email, password }),
      })
    );
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

export default Auth;
