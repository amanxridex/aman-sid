cmake_minimum_required(VERSION 3.16)
project(rakshak_core VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Optimization and security flags
if(MSVC)
    add_compile_options(/O2 /Oi /W4 /GL)
else()
    add_compile_options(-O3 -march=native -Wall -Wextra -fPIC -fvisibility=hidden)
endif()

include_directories(include)

# 1. Dynamic Shared Library (For Python ctypes / FFI)
add_library(rakshak_core SHARED src/rakshak_core.cpp)
target_compile_definitions(rakshak_core PRIVATE RAKSHAK_EXPORTS)

# 2. Standalone Verification Binary
add_executable(rakshak_verify src/rakshak_core.cpp)

set_target_properties(rakshak_core PROPERTIES
    PREFIX ""
    OUTPUT_NAME "rakshak_core"
)
