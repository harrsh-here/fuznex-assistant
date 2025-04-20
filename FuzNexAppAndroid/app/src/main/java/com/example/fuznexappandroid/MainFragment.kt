// 11. app/src/main/java/com/example/fuznexappandroid/MainFragment.kt
package com.example.fuznexappandroid

import android.os.Bundle
import android.view.*
import androidx.fragment.app.Fragment
import com.example.fuznexappandroid.databinding.FragmentMainBinding

class MainFragment : Fragment() {
    private var _binding: FragmentMainBinding? = null
    private val binding get() = _binding!!
    override fun onCreateView(inflater: LayoutInflater, c: ViewGroup?, s: Bundle?) =
        FragmentMainBinding.inflate(inflater, c, false).also { _binding = it }.root

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        binding.btnProfile.setOnClickListener {
            // TODO: navigate to profile/settings
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
