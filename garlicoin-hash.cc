#include <node.h>
#include <node_buffer.h>
#include <nan.h>

#include "Lyra2RE.h"
#include "scryptn.h"

using namespace v8;
using v8::Exception;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

class AddonData {
 public:
  AddonData(Isolate* isolate, Local<Object> exports):
      call_count(0) {
    // Link the existence of this object instance to the existence of exports.
    exports_.Reset(isolate, exports);
    exports_.SetWeak(this, DeleteMe, WeakCallbackType::kParameter);
  }

  ~AddonData() {
    if (!exports_.IsEmpty()) {
      // Reset the reference to avoid leaking data.
      exports_.ClearWeak();
      exports_.Reset();
    }
  }

  // Per-addon data.
  int call_count;

 private:
  // Method to call when "exports" is about to be garbage-collected.
  static void DeleteMe(const WeakCallbackInfo<AddonData>& info) {
    delete info.GetParameter();
  }

  // Weak handle to the "exports" object. An instance of this class will be
  // destroyed along with the exports object to which it is weakly bound.
  v8::Persistent<v8::Object> exports_;
};

/*
extern "C" NODE_MODULE_EXPORT void
NODE_MODULE_INITIALIZER(Local<Object> exports,
                        Local<Value> SumAllium,
                        Local<Context> context) {
}
*/

void SumAllium(const Nan::FunctionCallbackInfo<Value>& args) {
 
  if(args.Length() < 1) {
    Nan::ThrowTypeError("1 argument expected");
    return;
  }  

  Local<Object> target = args[0]->ToObject();

  if(!node::Buffer::HasInstance(target)) {
    Nan::ThrowTypeError("Function expects buffer as input");
    return;
  }

  char* input = node::Buffer::Data(target);
  char* output = new char[32];

  allium_hash(input, output);
  
  args.GetReturnValue().Set(Nan::NewBuffer(output, 32).ToLocalChecked());
}


NODE_MODULE_INIT() {
  exports->Set(Nan::New("SumAllium").ToLocalChecked(),
               Nan::New<v8::FunctionTemplate>(SumAllium)->GetFunction());
}


