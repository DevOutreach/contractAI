import grpc
import sys
import analysis_pb2
import analysis_pb2_grpc

def run():
    print("🔹 Connecting to gRPC server...")
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = analysis_pb2_grpc.AnalysisServiceStub(channel)
        
        # You can pass a command line argument as the input
        user_input = "Analyze this contract"
        if len(sys.argv) > 1:
            user_input = " ".join(sys.argv[1:])
            
        print(f"🔹 Sending request: '{user_input}'")
        try:
            response = stub.Analyze(analysis_pb2.AnalyzeRequest(user_input=user_input))
            print("✅ Received response:")
            for key, value in response.result.data.items():
                print(f"  {key}: {value}")
        except grpc.RpcError as e:
            print(f"❌ RPC failed: {e.code()} - {e.details()}")

if __name__ == '__main__':
    run()
