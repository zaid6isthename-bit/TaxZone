package com.taxzone.app

import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()   // Full-screen edge-to-edge display
        registerPlugin(SmsRetrieverPlugin::class.java)
    }
}
