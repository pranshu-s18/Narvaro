package `in`.co.prototek.narvaro

import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import java.util.concurrent.Executor

class Fingerprint : Fragment() {
    private lateinit var executor: Executor
    private lateinit var biometricPrompt: BiometricPrompt
    private lateinit var promptInfo: BiometricPrompt.PromptInfo

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        executor = ContextCompat.getMainExecutor(requireContext())
        biometricPrompt =
            BiometricPrompt(this, executor, object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    super.onAuthenticationError(errorCode, errString)
                    when (errorCode) {
                        BiometricPrompt.ERROR_NEGATIVE_BUTTON, BiometricPrompt.ERROR_USER_CANCELED ->
                            Toast.makeText(requireContext(), getString(R.string.F_Cancel), Toast.LENGTH_SHORT).show()

                        BiometricPrompt.ERROR_LOCKOUT, BiometricPrompt.ERROR_LOCKOUT_PERMANENT ->
                            Toast.makeText(requireContext(), getString(R.string.F_Lock), Toast.LENGTH_SHORT).show()

                        else -> {
                            Log.d(MainActivity.TAG, errString.toString())
                            Toast.makeText(requireContext(), getString(R.string.F_Error), Toast.LENGTH_SHORT).show()
                        }
                    }
                }

                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    super.onAuthenticationSucceeded(result)
                    findNavController().navigate(R.id.attendance)
                }
            })

        promptInfo = BiometricPrompt.PromptInfo.Builder().setTitle("Fingerprint Scan")
            .setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG)
            .setNegativeButtonText("Cancel").build()
    }

    override fun onStart() {
        super.onStart()
        if(checkBiometrics()) biometricPrompt.authenticate(promptInfo)
    }

    private fun checkBiometrics(): Boolean {
        val biometricManager = BiometricManager.from(requireContext())
        return when (biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG)) {
            BiometricManager.BIOMETRIC_SUCCESS -> true
            BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE -> {
                Toast.makeText(requireContext(), "Fingerprint scanner unavailable", Toast.LENGTH_SHORT).show()
                false
            }
            BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED -> {
                Toast.makeText(requireContext(), "Biometrics are not enrolled", Toast.LENGTH_SHORT).show()
                false
            }
            else -> {
                Toast.makeText(requireContext(), "Biometrics not supported", Toast.LENGTH_SHORT).show()
                false
            }
        }
    }
}