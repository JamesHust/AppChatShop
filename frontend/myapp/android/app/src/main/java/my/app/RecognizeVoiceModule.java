package my.app;

import android.app.Activity;
import android.content.Intent;
import android.speech.RecognizerIntent;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.ArrayList;
import java.util.Locale;

import static android.app.Activity.RESULT_OK;

public class RecognizeVoiceModule extends ReactContextBaseJavaModule implements ActivityEventListener{
    final ReactApplicationContext reactContext;
    protected static final int RESULT_SPEECH = 1;
    Promise promise;

    RecognizeVoiceModule(ReactApplicationContext context){
        super(context);
        this.reactContext = context;
        this.reactContext.addActivityEventListener(this);
    }

    /**
     * Hàm gọi và chuyển từ giong nói sang chữ - speech to text
     * */
    @ReactMethod
    public void startVoice(Promise promise){
        this.promise = promise;
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault());
        intent.putExtra(RecognizerIntent.EXTRA_PROMPT, "Cú pháp: ĐẶT [Số lượng][Đơn vị][Tên sản phẩm].");
        try{
            if (intent.resolveActivity(this.reactContext.getPackageManager()) != null) {
                this.reactContext.startActivityForResult(intent, RESULT_SPEECH, null);
            }
        }catch (Exception e){
            Toast.makeText(reactContext, ""+e.getMessage(), Toast.LENGTH_SHORT).show();
        }
    }

    /**
     * Hàm lấy xuất tên module
     * */
    @NonNull
    @Override
    public String getName() {
        return "RecognizeVoiceModule";
    }

    /**
     * Hàm custom gửi dữ liệu chuyển từ giọng nói sang text
     * */
    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        ArrayList<String> text = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
        this.promise.resolve(text.get(0));
    }

    @Override
    public void onNewIntent(Intent intent) { }
}
