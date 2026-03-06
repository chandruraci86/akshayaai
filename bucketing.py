import hashlib
import json

def generate_bucket_id(core_attributes: dict) -> str:
    """
    Generates a deterministic hash based on core attributes.
    core_attributes should be a dictionary containing at least:
    - metal_name
    - item_type_name
    - item_name
    - sub_item_name
    - metal_color
    - category
    - design_group
    - design_detail
    and any flexible_attributes that define the strict equality of an item.
    """
    # Sort keys to ensure deterministic ordering before hashing
    def sort_dict(d):
        return {k: sort_dict(v) if isinstance(v, dict) else v for k, v in sorted(d.items())}
        
    sorted_items = sort_dict(core_attributes)
    
    # Create a string representation
    string_to_hash = json.dumps(sorted_items, default=str, sort_keys=True)
    
    # Generate SHA-256 hash
    hash_object = hashlib.sha256(string_to_hash.encode())
    return hash_object.hexdigest()

def generate_bucket_name(core_attributes: dict) -> str:
    """
    Generates a readable abbreviated name (Option 2) based on key attributes.
    Example: GLD-22K-NCK-COMB (Gold, 22K, Necklace, Coimbatore)
    """
    parts = []
    
    # Define which keys are most important to show in the name in order
    keys_to_abbreviate = [
        ('metal_name', 3),       # GOLD -> GOL (or GLD if we built a custom dict, sticking to substring for simplicity)
        ('item_type_name', 3),   # 22K -> 22K
        ('item_name', 3),        # NECKLACE-G -> NEC
        ('design_group', 4)      # COIMBATORE -> COIM
    ]
    
    for key, length in keys_to_abbreviate:
        val = str(core_attributes.get(key, ''))
        if val and val.lower() not in ['nan', 'none']:
            # Strip non-alphanumeric, get first `length` characters, uppercase
            clean_val = ''.join(e for e in val if e.isalnum())
            if clean_val:
                parts.append(clean_val[:length].upper())
                
    # Fallback if no parts were generated (highly unlikely with this dataset)
    if not parts:
        return "GENERIC-BKT"
        
    return "-".join(parts)
