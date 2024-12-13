class errorResponse extends Error {
  constructor(
    statuscode,
    message = "something is not right",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statuscode = statuscode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = this.errors;
  }
  if(stack) {
    this.stack = stack;
  }
}
export default errorResponse;
