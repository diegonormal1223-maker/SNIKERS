package com.snikers.app.service;

import com.snikers.app.model.Address;
import com.snikers.app.model.User;
import com.snikers.app.repository.AddressRepository;
import com.snikers.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public List<Address> getUserAddresses(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    public Address createAddress(Long userId, Address address) {
        System.out.println("Creating address for user: " + userId);
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        address.setUser(user);
        validateAddress(address);

        // Fill legacy required fields
        if (address.getType() == null || address.getType().isEmpty()) {
            address.setType("shipping"); // default type
        }

        if (address.getLine1() == null || address.getLine1().isEmpty()) {
            address.setLine1(address.getStreetAddress() != null ? address.getStreetAddress() : "N/A");
        }

        // For city_id, we'll use a default value of 1 (Bogotá) if not provided
        if (address.getCityId() == null) {
            address.setCityId(1L); // Default to Bogotá
        }

        // Handle optional zipCode
        if (address.getZipCode() == null || address.getZipCode().isEmpty()) {
            address.setZipCode("00000");
        }

        // Set postalCode same as zipCode
        if (address.getPostalCode() == null || address.getPostalCode().isEmpty()) {
            address.setPostalCode(address.getZipCode());
        }

        // Set default country
        if (address.getCountry() == null || address.getCountry().isEmpty()) {
            address.setCountry("Colombia");
        }

        // Set fullName from recipientName if not present
        if (address.getFullName() == null || address.getFullName().isEmpty()) {
            address.setFullName(address.getRecipientName());
        }

        // Set street from streetAddress if not present
        if (address.getStreet() == null || address.getStreet().isEmpty()) {
            address.setStreet(address.getStreetAddress());
        }

        // If this is the first address, make it default
        List<Address> existingAddresses = addressRepository.findByUserId(userId);
        if (existingAddresses.isEmpty()) {
            address.setDefault(true);
        }

        try {
            return addressRepository.save(address);
        } catch (Exception e) {
            System.err.println("Error saving address: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public void deleteAddress(Long addressId) {
        if (addressId == null) {
            throw new IllegalArgumentException("Address ID cannot be null");
        }
        addressRepository.deleteById(addressId);
    }

    @Transactional
    public void setDefaultAddress(Long userId, Long addressId) {
        if (userId == null || addressId == null) {
            throw new IllegalArgumentException("User ID and Address ID cannot be null");
        }
        List<Address> addresses = addressRepository.findByUserId(userId);

        for (Address addr : addresses) {
            if (addr.getId().equals(addressId)) {
                addr.setDefault(true);
            } else {
                addr.setDefault(false);
            }
            addressRepository.save(addr);
        }
    }

    public Address updateAddress(Long userId, Long addressId, Address addressDetails) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to this address");
        }

        if (addressDetails.getLabel() != null)
            address.setLabel(addressDetails.getLabel());
        if (addressDetails.getRecipientName() != null)
            address.setRecipientName(addressDetails.getRecipientName());
        if (addressDetails.getStreetAddress() != null)
            address.setStreetAddress(addressDetails.getStreetAddress());
        if (addressDetails.getCity() != null)
            address.setCity(addressDetails.getCity());
        if (addressDetails.getState() != null)
            address.setState(addressDetails.getState());
        if (addressDetails.getPhone() != null)
            address.setPhone(addressDetails.getPhone());

        // Update legacy fields if needed
        if (addressDetails.getStreetAddress() != null)
            address.setLine1(addressDetails.getStreetAddress());

        if (addressDetails.getStreetAddress() != null)
            address.setLine1(addressDetails.getStreetAddress());

        validateAddress(address); // Validate updated state
        return addressRepository.save(address);
    }

    private void validateAddress(Address address) {
        if (address.getRecipientName() != null && !address.getRecipientName().isEmpty()) {
            if (!address.getRecipientName().matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$")) {
                throw new IllegalArgumentException("El nombre del destinatario no debe contener números ni símbolos.");
            }
        }

        if (address.getPhone() != null && !address.getPhone().isEmpty()) {
            if (!address.getPhone().matches("^(?:\\+57)?3\\d{9}$")) {
                throw new IllegalArgumentException("El teléfono debe ser un número válido de Colombia.");
            }
        }
    }
}
