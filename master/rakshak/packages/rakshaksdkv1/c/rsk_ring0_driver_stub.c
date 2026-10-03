/* ==============================================================================
 * RAKSHAK SECURITY KERNEL (RSK) - RING-0 DRIVER STUB & IOCTL INTERFACE
 * File: packages/rakshaksdkv1/c/rsk_ring0_driver_stub.c
 * License: Proprietary / Enterprise Air-Gapped EULA
 * ============================================================================== */

#include "rsk_ring0_driver_stub.h"

#if defined(_WIN32) || defined(_WIN64)
#ifndef WIN32_LEAN_AND_MEAN
#define WIN32_LEAN_AND_MEAN
#endif
#include <windows.h>
#else
#include <fcntl.h>
#include <unistd.h>
#include <sys/ioctl.h>
#endif

#include <string.h>

#define RAKSHAK_DEVICE_WIN32 "\\\\.\\RakshakKernelShield"
#define RAKSHAK_DEVICE_LINUX "/dev/rakshak_kernel_shield"

static void* g_driver_handle = (void*)((intptr_t)-1);

bool rsk_driver_is_connected(void) {
#if defined(_WIN32) || defined(_WIN64)
    if (g_driver_handle != (void*)((intptr_t)-1) && g_driver_handle != NULL) {
        return true;
    }
    HANDLE hDevice = CreateFileA(
        RAKSHAK_DEVICE_WIN32,
        GENERIC_READ | GENERIC_WRITE,
        FILE_SHARE_READ | FILE_SHARE_WRITE,
        NULL,
        OPEN_EXISTING,
        0,
        NULL
    );
    if (hDevice != INVALID_HANDLE_VALUE) {
        g_driver_handle = (void*)hDevice;
        return true;
    }
    return false;
#else
    if (access(RAKSHAK_DEVICE_LINUX, R_OK | W_OK) == 0) {
        return true;
    }
    return false;
#endif
}

int rsk_driver_dispatch_ioctl(uint32_t ioctl_code, const void* in_buf, uint32_t in_size, void* out_buf, uint32_t out_size) {
#if defined(_WIN32) || defined(_WIN64)
    if (!rsk_driver_is_connected()) {
        return -1; // Driver not reachable
    }

    DWORD bytes_returned = 0;
    BOOL ok = DeviceIoControl(
        (HANDLE)g_driver_handle,
        ioctl_code,
        (LPVOID)in_buf,
        in_size,
        out_buf,
        out_size,
        &bytes_returned,
        NULL
    );

    return ok ? (int)bytes_returned : -2;
#else
    return 0; // Simulated non-Windows kernel abstraction
#endif
}
