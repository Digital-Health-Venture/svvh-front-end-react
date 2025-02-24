export default {
  name: "MiddleFunction",
  methods: {
    _randomstring(type) {
      var text = "";
      if (type === "tel") {
        var max = 8;
        var possible = "0123456789";
      } else {
        var max = 5;
        var possible =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      }

      for (var i = 0; i < max; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    },
  },
};
