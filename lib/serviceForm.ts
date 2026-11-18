// Shared values for the add service form
export type ServiceValues = {
  title: string;
  category: string;
  description: string;
  basePrice: string;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
};

// An empty form, also used to clear the form after a success
export const EMPTY_SERVICE_VALUES: ServiceValues = {
  title: "",
  category: "",
  description: "",
  basePrice: "",
  estimatedDuration: "",
  serviceMode: "",
  serviceArea: "",
};

// Check the form and return the error messages
export function validateService(values: ServiceValues, file: File | null) {
  const errors: Record<string, string> = {};
  if (!values.title.trim()) errors.title = "Title is required";
  if (!values.category) errors.category = "Category is required";
  if (!values.description.trim()) errors.description = "Description is required";
  if (!values.basePrice.trim()) errors.basePrice = "Base price is required";
  else if (!(Number(values.basePrice) > 0))
    errors.basePrice = "Base price must be a positive number";
  if (!values.estimatedDuration.trim())
    errors.estimatedDuration = "Estimated duration is required";
  if (!values.serviceMode) errors.serviceMode = "Service mode is required";
  if (!values.serviceArea.trim()) errors.serviceArea = "Service area is required";
  if (!file) errors.image = "Service image is required";
  return errors;
}
