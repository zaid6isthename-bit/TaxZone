package com.taxzone.app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.google.android.gms.auth.api.phone.SmsRetriever
import com.google.android.gms.common.api.CommonStatusCodes
import com.google.android.gms.common.api.Status

@CapacitorPlugin(name = "SmsRetriever")
class SmsRetrieverPlugin : Plugin() {

    private var smsReceiver: BroadcastReceiver? = null

    @PluginMethod
    fun startListening(call: PluginCall) {
        val client = SmsRetriever.getClient(context)
        val task = client.startSmsRetriever()

        task.addOnSuccessListener {
            smsReceiver = object : BroadcastReceiver() {
                override fun onReceive(ctx: Context, intent: Intent) {
                    if (intent.action == SmsRetriever.SMS_RETRIEVED_ACTION) {
                        val extras = intent.extras
                        val status = extras?.get(SmsRetriever.EXTRA_STATUS) as? Status
                        
                        when (status?.statusCode) {
                            CommonStatusCodes.SUCCESS -> {
                                val message = extras.get(SmsRetriever.EXTRA_SMS_MESSAGE) as? String ?: ""
                                val otp = extractOtp(message)
                                if (otp != null) {
                                    val ret = JSObject()
                                    ret.put("otp", otp)
                                    notifyListeners("smsReceived", ret)
                                    call.resolve(ret)
                                }
                            }
                            CommonStatusCodes.TIMEOUT -> {
                                call.reject("TIMEOUT")
                            }
                        }
                    }
                }
            }
            val filter = IntentFilter(SmsRetriever.SMS_RETRIEVED_ACTION)
            // Use the activity context to register the receiver
            context.registerReceiver(smsReceiver, filter, SmsRetriever.SEND_PERMISSION, null)
        }

        task.addOnFailureListener {
            call.reject("SMS_RETRIEVER_START_FAILED", it.message)
        }
    }

    @PluginMethod
    fun stopListening(call: PluginCall) {
        try {
            smsReceiver?.let { context.unregisterReceiver(it) }
        } catch (e: Exception) {
            // Ignore if not registered
        }
        smsReceiver = null
        call.resolve()
    }

    private fun extractOtp(message: String): String? {
        return Regex("\\b(\\d{6})\\b").find(message)?.groupValues?.get(1)
    }
}
