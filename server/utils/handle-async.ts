export async function handleAsync<T, E>(
  fn: () => Promise<T>,
): Promise<
  | { data: T; error: null; success: true }
  | { data: null; error: E; success: false }
> {
  try {
    const data = await fn();

    return {
      data: data,
      error: null,
      success: true,
    };
  } catch (e) {
    return {
      data: null,
      error: e as E,
      success: false,
    };
  }
}
