import { useCallback, useState } from "react";

export default function useDebouncedState<T>(initial: T): [T, (_v: T) => void] {
    const [value, setValue] = useState<T>(initial);
    const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>();

    const callback = useCallback(
        (value: T) => {
            clearTimeout(timer);
            setTimer(
                setTimeout(() => {
                    setValue(value);
                }, 300)
            );
        },
        [timer]
    );

    return [value, callback];
}
