const { model, Schema } = require('mongoose');

const auditSchema = new Schema(
  {
    url: {
      type: Schema.Types.String,
      required: true
    },
    activity: {
      type: Schema.Types.String,
      required: true
    },
    params: {
      type: Schema.Types.String,
      required: true
    },
    query: {
      type: Schema.Types.String,
      required: true
    },
    payload: {
      type: Schema.Types.String,
      required: true
    },
    response: {
      type: Schema.Types.String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const auditModel = model('auditLog', auditSchema);
module.exports = auditModel;
