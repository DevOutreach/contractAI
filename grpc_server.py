import grpc
from concurrent import futures
import time
import os
import json
import requests
from dotenv import load_dotenv

import analysis_pb2
import analysis_pb2_grpc

# ✅ Load environment variables
load_dotenv()

# ✅ Config
AIRIA_KEY = os.getenv("AIRIA_KEY")
AIRIA_URL = "https://api.airia.ai/v2/PipelineExecution/b9791679-a12b-4cf4-b1e0-23534346baa6"

class AnalysisServiceServicer(analysis_pb2_grpc.AnalysisServiceServicer):
    def Analyze(self, request, context):
        try:
            user_input = request.user_input
            print("🔹 [gRPC] Received input:", user_input)

            response = requests.post(
                AIRIA_URL,
                headers={
                    "Content-Type": "application/json",
                    "X-API-KEY": AIRIA_KEY,
                },
                json={
                    "userInput": user_input,
                    "asyncOutput": False,
                },
                timeout=30
            )

            print("🔹 [gRPC] Airia response status:", response.status_code)
            try:
                data = response.json()
            except ValueError:
                print("❌ [gRPC] Failed to parse JSON. Raw response:", response.text)
                raise
            
            # Debug log success too
            # print("🔹 Raw response from Airia:", json.dumps(data, indent=2))
            # print("🔹 Raw response from Airia:", json.dumps(data, indent=2))

            parsed = None

            # ✅ Case 1: Newer Airia format (string under data.result)
            if "result" in data and isinstance(data["result"], str):
                try:
                    parsed = json.loads(data["result"])
                except json.JSONDecodeError:
                    parsed = data["result"]

            # ✅ Case 2: Older Claude-style format
            elif (
                "output" in data
                and isinstance(data["output"], list)
                and len(data["output"]) > 0
                and "content" in data["output"][0]
                and len(data["output"][0]["content"]) > 0
                and "text" in data["output"][0]["content"][0]
            ):
                parsed = json.loads(data["output"][0]["content"][0]["text"])

            else:
                raise Exception("Unrecognized Airia API response format")
            
            # Convert parsed dict to map<string, string>
            # We explicitly convert all values to strings to satisfy the proto definition
            result_data = {}
            if isinstance(parsed, dict):
                for k, v in parsed.items():
                    result_data[str(k)] = str(v)
            else:
                # Fallback if parsed is not a dict (e.g. list or primitive)
                result_data["result"] = str(parsed)

            return analysis_pb2.AnalyzeResponse(
                result=analysis_pb2.AnalysisResult(data=result_data)
            )

        except Exception as err:
            print("❌ [gRPC] Server error:", str(err))
            context.set_details(str(err))
            context.set_code(grpc.StatusCode.INTERNAL)
            return analysis_pb2.AnalyzeResponse()

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    analysis_pb2_grpc.add_AnalysisServiceServicer_to_server(AnalysisServiceServicer(), server)
    server.add_insecure_port('0.0.0.0:50051')
    print("✅ gRPC Server running on port 50051")
    server.start()
    try:
        while True:
            time.sleep(86400)
    except KeyboardInterrupt:
        server.stop(0)

if __name__ == '__main__':
    serve()
