import * as React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";

export default function QuantityAdjustmentsLog({ adjustments }) {
    return (
        <AuthenticatedLayout>
            <Head title="Adjustment Log" />
            <div className="overflow-x-auto">
                <table className="table-auto w-full">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-6 py-2 font-medium text-left text-white">Date</th>
                            <th className="px-6 py-2 font-medium text-left text-white">Product</th>
                            <th className="px-6 py-2 font-medium text-left text-white">Adjusted Qty</th>
                            <th className="px-6 py-2 font-medium text-left text-white">Adjustment</th>
                            <th className="px-6 py-2 font-medium text-left text-white">Reason</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {adjustments.map((adjustment) => (
                            <tr key={adjustment.id}>
                                <td className="border px-6 py-1">{dayjs(adjustment.created_at).format("DD/MM/YYYY")}</td>
                                <td className="border px-6 py-1">{adjustment.name}</td>
                                <td className="border px-6 py-1 text-sm">
                                    <span style={{ color: Number(adjustment.adjusted_quantity) < 0 ? 'red' : 'green' }}>
                                        {adjustment.adjusted_quantity}
                                    </span>
                                </td>
                                <td className="border px-6 py-1 text-sm">
                                    <span>
                                        {adjustment.previous_quantity}
                                    </span>
                                    {' → '}
                                    <span style={{ color: Number(adjustment.adjusted_quantity) < 0 ? 'red' : 'green' }}>
                                        {Number(adjustment.previous_quantity) + Number(adjustment.adjusted_quantity)}
                                    </span>
                                </td>
                                <td className="border px-6 py-1">{adjustment.reason}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}