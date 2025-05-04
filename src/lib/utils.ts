export function getUpdatedObject<T extends {}>(
    original: Partial<T>,
    updated: Partial<T>,
): Partial<T> {
    return Object.keys(original).reduce((result, k) => {
        const key = k as keyof T;
        if (original[key] !== updated[key]) result[key] = updated[key];
        return result;
    }, {} as Partial<T>);
}
