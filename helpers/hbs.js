const moment = require("moment");

module.exports = {
  formatDate: function (date, format) {
    return moment(date).format(format);
  },
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      return str.slice(0, len) + "...";
    } else {
      return str;
    }
  },
  stripTags: function (input) {
    return input.replace(/<\/?[^>]+(>|$)/g, "");
  },
};
