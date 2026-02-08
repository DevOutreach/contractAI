// package: analysis
// file: analysis.proto

var analysis_pb = require("./analysis_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var AnalysisService = (function () {
  function AnalysisService() {}
  AnalysisService.serviceName = "analysis.AnalysisService";
  return AnalysisService;
}());

AnalysisService.Analyze = {
  methodName: "Analyze",
  service: AnalysisService,
  requestStream: false,
  responseStream: false,
  requestType: analysis_pb.AnalyzeRequest,
  responseType: analysis_pb.AnalyzeResponse
};

exports.AnalysisService = AnalysisService;

function AnalysisServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

AnalysisServiceClient.prototype.analyze = function analyze(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AnalysisService.Analyze, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.AnalysisServiceClient = AnalysisServiceClient;

