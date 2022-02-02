package `in`.co.prototek.narvaro

import `in`.co.prototek.narvaro.databinding.FragmentAttendanceBinding
import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Criteria
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Bundle
import android.provider.Settings
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.app.ActivityCompat
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.preference.PreferenceManager
import com.android.volley.Response
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import com.google.firebase.auth.FirebaseAuth
import org.json.JSONObject


class Attendance : Fragment() {
    private var _binding: FragmentAttendanceBinding? = null
    private val binding get() = _binding!!
    private val loc: Array<Location> =
        arrayOf(Location(""), Location(""), Location(""), Location(""), Location(""))

    private lateinit var auth: FirebaseAuth
    private lateinit var lm: LocationManager
    private lateinit var locationListener: LocationListener
    private lateinit var hostel: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        getLocations()
        auth = FirebaseAuth.getInstance()
        lm = requireActivity().getSystemService(Context.LOCATION_SERVICE) as LocationManager
        hostel = PreferenceManager.getDefaultSharedPreferences(requireContext())
            .getString("hostel", "Test")!!
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentAttendanceBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        locationListener = LocationListener { location ->
            val x = when (hostel) {
                "BH1" -> 1
                "BH2" -> 2
                "BH3" -> 3
                "GH" -> 4
                else -> 0
            }

            if (location.distanceTo(loc[x]) < 50.0f) {
                val stringRequest: StringRequest =
                    object : StringRequest(Method.POST, getString(R.string.URL),
                        Response.Listener { response ->
                            val res = JSONObject(response)
                            binding.status.text = res["message"].toString()
                            lm.removeUpdates(locationListener)
                        },
                        Response.ErrorListener { e ->
                            val err = JSONObject(String(e.networkResponse.data))["error"].toString()
                            if(err == getString(R.string.server_error) || err == getString(R.string.already_marked)) lm.removeUpdates(locationListener)
                            binding.status.text = err
                        }) {
                        override fun getBodyContentType(): String {
                            return "application/json"
                        }

                        override fun getBody(): ByteArray {
                            val body = HashMap<String, String>()
                            body["hostel"] = hostel
                            body["uid"] = auth.currentUser!!.uid
                            return JSONObject(body as Map<String, String>).toString().toByteArray()
                        }
                    }
                val requestQueue = Volley.newRequestQueue(requireContext())
                requestQueue.add(stringRequest)
            } else binding.status.text = getString(R.string.not_within_radius)
        }

        binding.email.text = auth.currentUser!!.displayName
        binding.settingsBtn.setOnClickListener { findNavController().navigate(R.id.settings) }
        binding.location.setOnClickListener {
            hostel = PreferenceManager.getDefaultSharedPreferences(requireContext())
                .getString("hostel", "Test")!!
            getLocation()
        }
    }

    override fun onPause() {
        super.onPause()
        lm.removeUpdates(locationListener)
    }

    private fun checkPermission(): Boolean {
        return ActivityCompat.checkSelfPermission(
            requireActivity(),
            Manifest.permission.ACCESS_FINE_LOCATION
        ) != PackageManager.PERMISSION_GRANTED
    }

    private val permissionResult =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { result ->
            if (result) getLocation()
            else Toast.makeText(
                requireContext(),
                getString(R.string.permission_denied),
                Toast.LENGTH_LONG
            ).show()
        }

    private fun getLocation() {
        if (!checkPermission()) {
            val providers = lm.getProviders(true)
            if (providers.isNotEmpty()) {
                binding.status.text = getString(R.string.loading)

                if (providers.contains(LocationManager.NETWORK_PROVIDER)) {
                    lm.requestLocationUpdates(
                        LocationManager.NETWORK_PROVIDER,
                        1000L,
                        0f,
                        locationListener
                    )
                } else {
                    val criteria = Criteria()
                    criteria.accuracy = Criteria.ACCURACY_FINE

                    val bestProvider = lm.getBestProvider(criteria, true)!!
                    lm.requestLocationUpdates(bestProvider, 0L, 0f, locationListener)
                }
            } else {
                startActivity(Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS))
                Toast.makeText(requireContext(), "Turn on Location Access", Toast.LENGTH_LONG)
                    .show()
            }
        } else permissionResult.launch(Manifest.permission.ACCESS_FINE_LOCATION)
    }

    private fun getLocations() {
        loc[0].longitude = 73.888536
        loc[0].latitude = 18.479001
        loc[1].longitude = 78.169628
        loc[1].latitude = 26.249970
        loc[2].longitude = 78.169229
        loc[2].latitude = 26.250738
        loc[3].longitude = 78.169912
        loc[3].latitude = 26.249428
        loc[4].longitude = 78.176165
        loc[4].latitude = 26.246977
    }
}